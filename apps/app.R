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

#########
var_remove <- c("minimum_minimum_nights", "maximum_minimum_nights",
                "minimum_maximum_nights", "maximum_maximum_nights",
                "minimum_nights_avg_ntm", "maximum_nights_avg_ntm")

final_listings <- read_csv("./data/listing_processed.csv") %>%
    select(-all_of(var_remove)) %>%
    mutate(across(where(is.character), as.factor)) %>%
    mutate(across(where(is.logical), as.factor))

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
                    #for intro page
            ),
            tabItem("EDA",
                    tabsetPanel(
                        tabPanel("Summary of variables",
                                 observeUI('observe'),
                        ),
                        tabPanel("Explore variables",
                                 #put ui here
                        ),
                        tabPanel("Map",
                                 #put ui here
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
    
    
    ##### observe variables tab#####
    observeServer('observe', final_listings)
    
    ##### explore tab#####
    
    
    
    
    
    
    
    
    ########### predictive server file ###########
    return_val1 <- data_splittingServer("ds", final_listings)
    feat_selectServer("fs", final_listings, return_val1)
    data_transformServer("dtf", final_listings, return_val1)
    ############################################
    
}

# Run the application 
shinyApp(ui = ui, server = server)
