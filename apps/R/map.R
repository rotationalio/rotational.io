#' Target variable selection,
#' Data splitting,
#' Distribution plot
#'
#' @param id, character used to specify namespace, see \code{shiny::\link[shiny]{NS}}
#'
#' @return a \code{shiny::\link[shiny]{tagList}} containing UI elements
#' 

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

# collapse dataframe and summarise price by neighbourhood
listing_summary <- final_listings %>% 
  group_by(neighbourhood_cleansed) %>%
  summarise(avg_price_pp = round(mean(price_per_pax),0),
            min_price_pp = round(min(price_per_pax),0),
            max_price_pp = round(max(price_per_pax),0)) %>%
  mutate_at(.vars = vars(neighbourhood_cleansed), .funs= funs(toupper))

# join by neighbourhood and planning area
airbnb_map <- right_join(mpsz2,listing_summary, c("PLN_AREA_N" = 'neighbourhood_cleansed'))


mapUI <- function(id){
  fluidPage(
    titlePanel("Mapping Airbnb Singapore"),
    sidebarLayout(
      sidebarPanel(
        selectInput(inputId = NS(id,'map_type'),
                    label = 'Select map type',
                    choices = c('Point Symbol map',
                                'Choropleth map'),
                    selected = 'Point Symbol map'),
        
        uiOutput(NS(id,'point_view')),
        uiOutput(NS(id,'show_data')),
        width = 3
      ),
      mainPanel(
        leafletOutput(NS(id,'leaf_map'),height = 700),
        conditionalPanel(
          condition = "input.map_type == 'Choropleth map'",
          DT::dataTableOutput(NS(id,'szTable')))
      )
      
    )
  )
  
}

mapServer <- function(id, final_listings){
  moduleServer(id, function(input, output, session){
    
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
        DT::datatable(data = airbnb %>% select(1:7),
                      options=list(pageLength = 10),
                      rownames = FALSE)
      }
    })
    
  })
}

