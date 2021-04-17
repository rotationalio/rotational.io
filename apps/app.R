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

#########
var_remove <- c("minimum_minimum_nights", "maximum_minimum_nights",
                "minimum_maximum_nights", "maximum_maximum_nights",
                "minimum_nights_avg_ntm", "maximum_nights_avg_ntm")

final_listings <- read_csv("./data/listing_processed.csv") %>%
    select(-all_of(var_remove))
########


# Define UI for application that draws a histogram
ui <- dashboardPage(
    dashboardHeader(title = "Airbnb ShinyPET"),         
    
    dashboardSidebar(
        sidebarMenu(
            menuItem("Introduction", tabName = "Intro"),
            menuItem("EDA module", tabName = "EDA"),
            menuItem("Text module", tabName = "TA"),
            menuItem("Predictive module", tabName = "PA")
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
                                 titlePanel("Observe variables"),
                                 sidebarLayout(
                                     sidebarPanel(
                                         checkboxGroupInput('variables',
                                                            'Select variables for observation',
                                                            choices = names(final_listings), 
                                                            selected = c('price','room_type','review_scores_rating','host_is_superhost'), 
                                                            width = 3),
                                         numericInput("obs", "Number of observations to view", 10)
                                         ),
                                     mainPanel(
                                         verbatimTextOutput('summary'),
                                         tableOutput('view')
                                         )
                                     )
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
                        tabPanel("Feature importance",
                                 feat_selectUI("fs")
                                 ),
                        tabPanel("Data transformation",
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
    
    listing_split <- data_splittingServer("ds", final_listings)
    feat_selectServer("fs", final_listings, listing_split)
    
   # Return the requested dataset
    variableInput <- reactive({
        final_listings %>% select(all_of(input$variables))
    })


     output$summary <- renderPrint({
        dataset <- variableInput()
        summary(dataset)
    })

     output$view <- renderTable({
         head(variableInput(), n = input$obs)
     })
}

# Run the application 
shinyApp(ui = ui, server = server)
