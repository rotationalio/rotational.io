#' Target variable selection,
#' Data splitting,
#' Distribution plot
#'
#' @param id, character used to specify namespace, see \code{shiny::\link[shiny]{NS}}
#'
#' @return a \code{shiny::\link[shiny]{tagList}} containing UI elements
#' 

final_listings <- read_csv("./data/listing_processed.csv") %>%
  select(-all_of(var_remove)) %>%
  mutate(across(where(is.character), as.factor)) %>%
  mutate(across(where(is.logical), as.factor)) %>%
  mutate(price_per_pax = price/accommodates)

linebreaks <- function(n){HTML(strrep(br(), n))}

mapUI <- function(id){
  fluidPage(
    tags$style(
      type = 'text/css', 
      '.bg-orange {background-color: #FF5A5F!important; }'
    ),
    titlePanel("Mapping Airbnb Singapore"),
    sidebarLayout(
      sidebarPanel(
        setSliderColor(c("#FF5A60","#FF5A60"), c(1,2)),
        selectInput(inputId = NS(id,'map_type'),
                    label = 'Select map type',
                    choices = c('Point Symbol map',
                                'Choropleth map'),
                    selected = 'Point Symbol map'),
        
        uiOutput(NS(id,'point_view')),
        
        width = 3
        
      ),
      mainPanel(
        fluidRow(
          box(
            title = "Number of listings",width = 4,background = "orange",
            'xxx'
          ),
          
          box(
            title = "Price per person", width = 4, background = "orange",
            "Average", 
            br(),
            "Min",
            br(),
            "Max"
          ),
          
          box(
            title = "Review Scores",width = 4, background = "orange",
            "Average", 
            br(),
            "Min",
            br(),
            "Max"),
          
        leafletOutput(NS(id,'point_map'), height = 600)
      )
      )
    )
  )
  
}

mapServer <- function(id, final_listings){
  moduleServer(id, function(input, output, session){
    
    output$point_view <- renderUI({
      if (input$map_type == "Point Symbol map") {
        selectInput(inputId = 'filter_point',
                    label = 'View by',
                    choices = c('None',
                                'Host status',
                                'Room type'),
                    selected = 'Host status')}
      else {
        selectInput(inputId = 'filter_pleth',
                    label = 'Show subzone by',
                    choices = c('None',
                                'Count',
                                'Price'),
                    selected = 'Count')
      }
    })
    
    output$point_map <- renderLeaflet({
      
      subzone <- readOGR(dsn = "data/spatial", layer="MP14_SUBZONE_WEB_PL")
      
      airbnb <- select(final_listings, host_is_superhost, review_scores_rating, 
                       neighbourhood_cleansed, room_type, price_per_pax, latitude, longitude)
      
      airbnb_sf <- st_as_sf(airbnb, coords = c("longitude", "latitude"), crs = 4326)
      
      sg_host <- levels(final_listings$host_is_superhost)
      
      sg_rooms <- levels(final_listings$room_type)
      pal <- colorFactor(c("plum3", "red","black","blue"), domain = sg_rooms)
      
      point_map <- leaflet(airbnb_sf) %>%
        addTiles() %>%
        addProviderTiles('Esri.WorldGrayCanvas') %>%
        addCircleMarkers(
          radius = 2,
          color = ~pal(room_type),
          stroke = FALSE,
          fillOpacity = 0.5,
          label = ~round(price_per_pax,2)) %>%
        addLegend(pal = pal,
                  values = ~room_type,
                  opacity = 0.5,
                  title = 'Airbnb room types',
                  position = 'bottomright')
      point_map
    })
    
    
    
    
    
    
  })
}

