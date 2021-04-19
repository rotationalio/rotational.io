library(shiny)
library(shinydashboard)
library(shinyWidgets)
library(tidyverse)
library(ggstatsplot)
library(plotly)
library(readr)
library(leaflet)
library(haven)
library(funModeling)
library(crosstalk)
library(data.table)
library(ggplot2)
library(tidytext)
library(ggfittext)
library(tidymodels)
library(ggcorrplot)
library(vip)
library(Boruta)
library(reshape2)
library(shinycssloaders)
library(ranger)
library(skimr)
library(shinythemes)
library(rgdal)
library(sf)
library(tmap)

#########
var_remove <- c("minimum_minimum_nights", "maximum_minimum_nights",
                "minimum_maximum_nights", "maximum_maximum_nights",
                "minimum_nights_avg_ntm", "maximum_nights_avg_ntm")

final_listings <- read_csv("./data/listing_processed.csv") %>%
    select(-all_of(var_remove)) %>%
    mutate(across(where(is.character), as.factor)) %>%
    mutate(across(where(is.logical), as.factor)) %>%
    mutate(price_per_pax = price/accommodates)

subzone <- readOGR(dsn = "data/spatial", layer="MP14_SUBZONE_WEB_PL")
airbnb <- select(final_listings, host_is_superhost, review_scores_rating, 
                 neighbourhood_cleansed, room_type, price_per_pax, latitude, longitude)
airbnb <- subset(airbnb, !is.na(host_is_superhost))
airbnb_sf <- st_as_sf(airbnb, coords = c("longitude", "latitude"), crs = 4326)

mpsz2 <- st_read(dsn = 'data/spatial',
                 layer = 'MP14_SUBZONE_WEB_PL', 
                 quiet = TRUE) %>%
    group_by(PLN_AREA_N) %>%
    summarise(geometry = sf::st_union(geometry))

listing_summary <- final_listings %>% 
    group_by(neighbourhood_cleansed) %>%
    summarise(avg_price_pp = round(mean(price_per_pax),0),
              min_price_pp = round(min(price_per_pax),0),
              max_price_pp = round(max(price_per_pax),0),
              avg_review_score = round(mean(review_scores_rating, na.rm = TRUE),0)) %>%
    mutate_at(.vars = vars(neighbourhood_cleansed), .funs= funs(toupper))

airbnb_map <- right_join(mpsz2,listing_summary, c("PLN_AREA_N" = 'neighbourhood_cleansed'))


########


ui <- dashboardPage(
    skin = 'black',
    dashboardHeader(title = "Airbnb ShinyPET"),         
    
    dashboardSidebar(
        sidebarMenu(
            menuItem("Introduction", tabName = "Intro", icon = icon('airbnb')),
            menuItem("EDA module", tabName = "EDA", icon = icon('chart-bar')),
            menuItem("Text module", tabName = "TA", icon = icon('text-height')),
            menuItem("Predictive module", tabName = "PA", icon = icon('chart-line'))
        )
    ),
    
    dashboardBody(
        tabItems(
            tabItem("Intro",
                    fluidPage(theme = shinytheme('journal')) #https://rstudio.github.io/shinythemes/
                    #for intro page
            ),
            tabItem("EDA",
                    tabsetPanel(
                        tabPanel("Observe variables",
                                 observeUI('observe')
                        ),
                        tabPanel("Explore variables",
                                 #put ui here
                        ),
                        tabPanel("Map",
                                 fluidPage(
                                     titlePanel("Mapping Airbnb Singapore"),
                                     sidebarLayout(
                                         sidebarPanel(
                                             
                                             selectInput(inputId = 'map_type',
                                                         label = 'Select map type',
                                                         choices = c('Point Symbol map',
                                                                     'Choropleth map'),
                                                         selected = 'Point Symbol map'),
                                             uiOutput('point_view'),
                                             uiOutput('show_data'),
                                             width = 2
                                         ),
                                         mainPanel(
                                             leafletOutput('leaf_map', height = 800),
                                             conditionalPanel(
                                                 condition = "input.map_type == 'Choropleth map'",
                                                 DT::dataTableOutput('szTable')
                                             )
                                             
                                         )
                                     )
                                 )
                        )
                    ),
            ),
            tabItem("TA",
                    tabsetPanel(
                        tabPanel("Token frequency",
                                 #put ui here
                        ),
                        tabPanel("Sentiment analysis",
                                 #put ui here
                        ),
                        tabPanel("Topic modeling",
                                 #put ui here
                        ),
                        tabPanel("Network analysis",
                                 #put ui here
                        )
                    )
            ),
            tabItem("PA",
                    tabsetPanel(
                        tabPanel("Data splitting",
                                 data_splittingUI("ds")
                        ),
                        tabPanel("Feature selection",
                                 feat_selectUI("fs")
                        ),
                        tabPanel("Data transformation",
                                 data_transformUI("dtf")
                        ),
                        tabPanel("Model training",
                        ),
                        tabPanel("Model evaluation")
                    )
            )
        )
    )
)

# Define server logic required to draw a histogram
server <- function(input, output) {
    
    
    ##### observe tab#####
    observeServer('observe', final_listings)
    
    #### Explore tab ######
    
    
    ##### map ta b#####
    output$point_view <- renderUI({
        if (input$map_type == "Point Symbol map") {
            selectInput(inputId = 'filter_point',
                        label = 'View by',
                        choices = c('Superhost' = 'superhost',
                                    'Room type' = 'room_type'),
                        selected = 'Host status')} })
    
    output$show_data <- renderUI({
        if(input$map_type == "Choropleth map"){
            checkboxInput(inputId = 'show_data',
                          label = "Show data table",
                          value = FALSE)
        }
    })
    
    output$leaf_map <- renderLeaflet({
        
        superhost <- leaflet(airbnb_sf) %>%
            addTiles() %>%
            addProviderTiles('OneMapSG.Original', group = 'Original') %>%
            addProviderTiles('OneMapSG.Grey', group = 'Grey') %>%
            addProviderTiles('OneMapSG.Night', group = 'Night') %>%
            addCircleMarkers(
                data = airbnb[airbnb$host_is_superhost == 'TRUE',],
                lng = ~longitude,
                lat = ~latitude,
                color = '#FF5A5F',
                radius = 2,
                stroke = FALSE,
                fillOpacity = 0.5,
                group = 'Superhost'
            ) %>%
            addCircleMarkers(
                data = airbnb[airbnb$host_is_superhost == 'FALSE',],
                lng = ~longitude,
                lat = ~latitude,
                color = '#00A699',
                radius = 2,
                stroke = FALSE,
                fillOpacity = 0.5,
                group = 'Regular_host'
            ) %>%
            addLayersControl(baseGroups = c('Original', 'Grey', 'Night'),
                             overlayGroups = c('Superhost','Regular_host'),
                             options = layersControlOptions(collapsed = FALSE))
        
        rooms <- leaflet(airbnb_sf) %>%
            addTiles() %>%
            addProviderTiles('OneMapSG.Original', group = 'Original') %>%
            addProviderTiles('OneMapSG.Grey', group = 'Grey') %>%
            addProviderTiles('OneMapSG.Night', group = 'Night') %>%
            addCircleMarkers(
                data = airbnb[airbnb$room_type == 'Entire home/apt',],
                lng = ~longitude,
                lat = ~latitude,
                color = '#FF5A5F',
                radius = 2,
                stroke = FALSE,
                fillOpacity = 0.5,
                group = 'Entire home'
            ) %>%
            addCircleMarkers(
                data = airbnb[airbnb$room_type == 'Hotel room',],
                lng = ~longitude,
                lat = ~latitude,
                color = '#00A699',
                radius = 2,
                stroke = FALSE,
                fillOpacity = 0.5,
                group = 'Hotel room'
            ) %>%
            addCircleMarkers(
                data = airbnb[airbnb$room_type == 'Private room',],
                lng = ~longitude,
                lat = ~latitude,
                color = '#3182bd',
                radius = 2,
                stroke = FALSE,
                fillOpacity = 0.5,
                group = 'Private room'
            ) %>%
            addCircleMarkers(
                data = airbnb[airbnb$room_type == 'Shared room',],
                lng = ~longitude,
                lat = ~latitude,
                color = '#756bb1',
                radius = 2,
                stroke = FALSE,
                fillOpacity = 0.5,
                group = 'Shared room'
            ) %>%  
            addLayersControl(baseGroups = c('Original', 'Grey', 'Night'),
                             overlayGroups = c('Entire home','Hotel room', 'Private room','Shared room'),
                             options = layersControlOptions(collapsed = FALSE))
        
        
        
        avg_price <- tm_shape(mpsz2)+
            tm_polygons() +
            tm_shape(airbnb_map) +
            tm_fill('avg_price_pp',
                    n = 6,
                    style = 'quantile',
                    palette = 'Blues')+
            tm_borders(lwd = 0.5, alpha = 1)
        
        
        cho_map <- tmap_leaflet(avg_price) %>%
            addTiles() %>%
            addProviderTiles('OneMapSG.Original', group = 'Original') %>%
            addProviderTiles('OneMapSG.Grey', group = 'Grey') %>%
            addProviderTiles('OneMapSG.Night', group = 'Night') %>%
            addLayersControl(baseGroups = c('Original', 'Grey', 'Night'),
                             options = layersControlOptions(collapsed = FALSE))
        
        if(input$map_type == 'Choropleth map'){cho_map}
        else if(input$filter_point == 'superhost'){ superhost}
        else if (input$filter_point == 'room_type') {rooms}
        
    })
    
    output$szTable <- DT::renderDataTable({
        if(input$show_data){
            DT::datatable(data = listing_summary)
        }
    })
    
    
    
    
    
    
    
    ########### predictive server file ###########
    return_val1 <- data_splittingServer("ds", final_listings)
    feat_selectServer("fs", final_listings, return_val1)
    data_transformServer("dtf", final_listings, return_val1)
    ############################################
    
}

# Run the application 
shinyApp(ui = ui, server = server)
