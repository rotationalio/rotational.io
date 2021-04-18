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
                                 titlePanel("Observe variables"),
                                 fluidRow(
                                     infoBoxOutput('variableBox', width = 3),
                                     infoBoxOutput('obBox', width = 3),
                                     infoBoxOutput('factorsBox',width = 3),
                                     infoBoxOutput('numericBox', width = 3)
                                 ),
                                 fluidRow(
                                     box(title = 'Summary of factor variables',
                                         DT::dataTableOutput('categorical')),
                                     box(title = 'Summary of numerical variables',
                                         DT::dataTableOutput('numeric'))
                                 ),
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
    
    ##############
    # EDA
    ##############
    
    ##### observe variables tab#####
    output$variableBox <- renderInfoBox({
        infoBox(
            'Variables',
            value = tags$p(paste0(length(final_listings)),style = "font-size: 200%;"),
            icon = icon('info'),
            color = 'orange',
            fill = TRUE
        )
    })
    
    output$obBox <- renderInfoBox({
        infoBox(
            'Observations',
            value = tags$p(paste0(nrow(final_listings)), style = "font-size: 200%;"),
            icon = icon('list'),
            color = 'orange',
            fill = TRUE
        )
    })    
    
    output$factorsBox <- renderInfoBox({
        infoBox(
            'Factor variables',
            value = tags$p(paste0(length(which(sapply(final_listings, is.factor)==TRUE))),style = "font-size: 200%;"),
            icon = icon('chart-pie'),
            color = 'orange',
            fill = TRUE
        )
    })
    
    
    output$numericBox <- renderInfoBox({
        infoBox(
            'Numerical variables',
            value = tags$p(paste0(length(which(sapply(final_listings, is.numeric)==TRUE))),style = "font-size: 200%;"),
            icon = icon('chart-line'),
            color = 'orange',
            fill = TRUE
        )
    })
    
    output$numeric <- DT::renderDataTable({
        
        skimDf <- final_listings %>%
            skim_without_charts()
        
        sum_n <-if ("numeric" %in% skimDf$skim_type){
            skimDf %>%
                yank('numeric') %>%
                select('skim_variable','n_missing','complete_rate',
                       'mean','sd','p0','p50','p100') %>%
                arrange(-n_missing) %>%
                mutate_if(is.numeric, round, digit = 2)}
        
        sum_n
    })
    
    output$categorical <- DT::renderDataTable({
        
        skimDf <- final_listings %>%
            skim_without_charts()
        
        sum_f <-if ("factor" %in% skimDf$skim_type){
            skimDf %>% 
                yank("factor") %>% 
                arrange(-n_missing) %>%
                mutate_if(is.numeric, round, digit = 2)}
        
        sum_f
    })
    ##### explore tab#####
    
    
    
    ##############
    # END EDA
    ##############
     
     
     
     
     
     
     ########### predictive server file ###########
     return_val1 <- data_splittingServer("ds", final_listings)
     feat_selectServer("fs", final_listings, return_val1)
     data_transformServer("dtf", final_listings, return_val1)
     ############################################
     
}

# Run the application 
shinyApp(ui = ui, server = server)
