#' Target variable selection,
#' Data splitting,
#' Distribution plot
#'
#' @param id, character used to specify namespace, see \code{shiny::\link[shiny]{NS}}
#'
#' @return a \code{shiny::\link[shiny]{tagList}} containing UI elements
#' 

data_splittingUI <- function(id){
  fluidPage(
    sidebarLayout(
      sidebarPanel(
        pickerInput(
          inputId = NS(id, "Itarget_var"), label = "Choose response variable:",
          choices = c("price", "review_scores_rating"), selected = "price"),
        sliderInput(NS(id, "Itrain_prop"), "Training set proportion (%)",
                    value = 80, min = 50, max = 100, step = 5),
        actionButton(NS(id, "btn_split_data"), "Split data")
      , width = 3),
      mainPanel(
        (div(style='height: 500px; overflow-x: scroll',
                       plotlyOutput(NS(id, "Oplot_traintest_dense"))%>%
               withSpinner(color="#0dc5c1")
                       )),
        
        plotlyOutput(NS(id, "Oplot_traintest_bar")) %>% withSpinner(color="#0dc5c1")
      , width = 9)
    )
  )
}

data_splittingServer <- function(id, final_listings){
  moduleServer(id, function(input, output, session){
    set.seed(1234)
    
    # # for debugging, this will print out in console
    # observe({
    #   msg <- sprintf(names(final_listings))
    #   cat(msg, "\n")
    # })
    output$Oplot_traintest_dense <- renderPlotly(NULL)
    output$Oplot_traintest_bar <- renderPlotly(NULL)

    observeEvent(input$btn_split_data, {
      
      listing_split <- final_listings %>%
        drop_na(input$Itarget_var) %>% #remove rows where target variable is missing
        mutate(id = row_number()) %>%
        initial_split(prop = input$Itrain_prop/100, strata = input$Itarget_var)
    
      listing_train <- training(listing_split)
      listing_test <- testing(listing_split)
      
      train_grp <- listing_train %>%
        mutate(split = "training")
      
      test_grp <- listing_test %>%
        mutate(split = "test")
      
      trainTest_grp <- rbind(train_grp, test_grp)
      
      output$Oplot_traintest_dense <- renderPlotly({
        trainTest_p <- trainTest_grp %>%
          select(where(is.numeric) | split) %>%
          select(-id) %>%
          gather(key, value, -split) %>%
          ggplot(aes(x = value, fill = split)) +
          facet_wrap(~ key, scales = "free", nrow = 2) +
          geom_density(alpha=0.5) +
          ggtitle("Numerical variables") +
          theme(panel.spacing.y = unit(3, "lines"),
                plot.margin = margin(1, 5, 0, 5))
        ggplotly(trainTest_p,
                 width = 6000, height = 470) %>%
          layout(legend = list(orientation = "h", x=0, y=1.3))
        })
      
      output$Oplot_traintest_bar <- renderPlotly({
        trainTest_p2 <- trainTest_grp %>%
          select(where(negate(is.numeric)) | split) %>%
          gather(key, value, -split) %>%
          filter(!is.na(value)) %>%
          ggplot(aes(x = value, fill = split)) +
          facet_wrap(~ key, scales = "free", ncol = 3) +
          geom_bar() +
          ggtitle("Categorical variables") +
          theme(axis.text.x = element_blank())
        ggplotly(trainTest_p2)
        })
      return(Rlisting_split = reactive(listing_split))
      })
    
    })
}
