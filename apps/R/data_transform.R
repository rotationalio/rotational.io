#' Data transformation
#'
#' @param id, character used to specify namespace, see \code{shiny::\link[shiny]{NS}}
#'
#' @return a \code{shiny::\link[shiny]{tagList}} containing UI elements
#' 

data_transformUI <- function(id){
  tabsetPanel(
    tabPanel("Variables and Recipe",
             fluidPage(
                multiInput(
                  inputId = NS(id, "Inum_vars_sel"),
                  label = "Variable selection :",
                  choices = character(0),
                  width = "900px"),
                actionButton(NS(id, "btn_all_num"), "Select all"),
                actionButton(NS(id, "btn_des_all_num"), "Deselect all"),
                actionButton(NS(id, "btn_rcpTransform"), "Prepare recipe"),
                br(),
                verbatimTextOutput(NS(id, "Otransform_recipe")),
                actionButton(NS(id, "btn_rcpApply"), "Transform variables")
                )),
    tabPanel("Transformed variable",
             pickerInput(
               inputId = NS(id, "Iproc_var"),
               label = "Check transformed variables:",
               choices = NULL),
             plotlyOutput(NS(id, "Otransformed_plot")) %>% withSpinner(color="#5b7d7c")
             )
  )
}

data_transformServer <- function(id, final_listings, return_val1){
  moduleServer(id, function(input, output, session){
    output$Otransformed_plot <- renderPlotly(NULL)
    
    var_list <- reactive({
      final_listings %>%
        select(-all_of(return_val1$targetvar())) %>%
        names() %>%
        str_sort()
    })
      
    # # for debugging, this will print out in console
    # observe({
    #   msg <- sprintf(var_list_num())
    #   cat(msg, "\n")
    # })

    observe({
      updateMultiInput(
        session = session,
        inputId = "Inum_vars_sel",
        choices = var_list())
    })

    observeEvent(input$btn_all_num, {
      updateMultiInput(
        session = session,
        inputId = "Inum_vars_sel",
        selected = var_list()
      )
    })

    observeEvent(input$btn_des_all_num, {
      updateMultiInput(
        session = session,
        inputId = "Inum_vars_sel",
        selected = character(0)
      )
    })

    ################

    RtrainTProcessed <- reactiveVal(NULL)
    RrcpTransform <- reactiveVal(NULL)
    Rdatasplit <- reactiveVal(NULL)
    
    observeEvent(input$btn_rcpTransform,{
      
      #split again based on user selection
      set.seed(1234)
      listing_split <- final_listings %>%
        drop_na(return_val1$targetvar()) %>% #remove rows where target variable is missing
        select(input$Inum_vars_sel, return_val1$targetvar()) %>%
        mutate(id = row_number()) %>%
        initial_split(prop = return_val1$Iprop()/100, strata = return_val1$targetvar())
      
      Rdatasplit(listing_split)
      
      f <- as.formula(paste(return_val1$targetvar(), "~ ."))

      listing_train <- training(listing_split)
      
      rcpTransform <- recipe(f, data = training(Rdatasplit())) %>%
      # rcpTransform <- recipe(f, data = listing_train) %>%
        update_role(id, new_role = "id variable") %>%
        step_naomit(all_predictors(), skip = TRUE) %>% #remove rows with NA
        step_corr(all_numeric(), -all_outcomes(), threshold = 0.7,
                  method = "pearson") %>% #remove correlated variables at 0.7 threshold
        step_normalize(all_numeric(), -all_outcomes()) %>%
        step_other(all_predictors(), -all_numeric(),
                   threshold = 0.05, other = "Others") %>%
        step_dummy(all_nominal(), -all_outcomes())

      output$Otransform_recipe <- renderPrint(rcpTransform)
      
      RrcpTransform(rcpTransform)
      })
    
    observeEvent(input$btn_rcpApply,{
      validate(
        need(RrcpTransform(), 'Please prepare recipe')
      )
      #see the transformed data
      listingTrain_T <- RrcpTransform() %>% prep() %>% juice()

      listingTrain_T %>%
        gather() %>%
        ggplot(aes(x = value)) +
        facet_wrap(~ key, scales = "free", ncol = 4) +
        geom_bar()

      listing_train_var <- training(Rdatasplit()) %>%
        keep(is.numeric) %>%
        names()

      listingTrain_T_var <- listingTrain_T %>%
        keep(is.numeric) %>%
        names()

      intersect_vars <- intersect(listing_train_var, listingTrain_T_var)
      intersect_vars <- intersect_vars[intersect_vars != "id"]

      updatePickerInput(
        session = session,
        inputId = "Iproc_var",
        choices = intersect_vars)

      train_proc <- training(Rdatasplit()) %>%
        select(all_of(intersect_vars)) %>%
        mutate(processed = "original")

      train_T_proc <- listingTrain_T %>%
        select(all_of(intersect_vars)) %>%
        mutate(processed = "processed")

      RtrainTProcessed(rbind(train_proc, train_T_proc))
    })

    output$Otransformed_plot <- renderPlotly(
      ggplotly(
        RtrainTProcessed() %>%
          select(input$Iproc_var | processed) %>%
          gather(key, value, -processed) %>%
          ggplot(aes(x = value, fill = processed)) +
          facet_wrap(~ processed, scales = "free_x") +
          geom_histogram(alpha=0.5))
    )
    ######################
    
  })
}
