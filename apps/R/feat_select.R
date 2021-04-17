#' Feature selection
#'
#' @param id, character used to specify namespace, see \code{shiny::\link[shiny]{NS}}
#'
#' @return a \code{shiny::\link[shiny]{tagList}} containing UI elements
#' 

feat_selectUI <- function(id){
  tabsetPanel(
    tabPanel("Correlation matrix",
             fluidPage(
               fluidRow(
                 column(3,
                        radioButtons(
                          inputId = NS(id, "Icorr_type"),
                          label = "Correlation type:",
                          choices = c("Pearson", "Spearman", "Kendall")),
                        pickerInput(
                          inputId = NS(id, "Isig_lvl_corr"),
                          label = "p-value:",
                          choices = c("0.01", "0.05", "0.1"),
                          selected = "0.05"),
                        actionButton(NS(id, "btn_corrplot"), "Plot correlation matrix")
                 ),
                 column(9,
                        multiInput(
                          inputId = NS(id, "Inum_vars_corr"),
                          label = "Choose from numeric variables :",
                          choices = character(0),
                          width = "900px"),
                        actionButton(NS(id, "btn_all_num"), "Select all"),
                        actionButton(NS(id, "btn_des_all_num"), "Deselect all")
                 )),
               
               plotlyOutput(NS(id, "Oplot_corrmat"), height = "auto") %>%
                 withSpinner(color="#5b7d7c")
               )
             ),
    tabPanel("Feature importance",
             fluidPage(
               h4("Feature importance using Random forest and Boruta method"),
               p("For feature importance, we use `random forest` method (from",
               em("ranger"), "package) and `Boruta` method (from", em("Boruta"),
               "package as comparison for feature importance analysis.
               The features will be sorted according to the
                 importance score."),
               em("The importance value is different for the two
                 different methods and they are not to be compared"),
               br(),
               br(),
               actionButton(NS(id, "btn_get_ftimp"), "Calculate feature importance"),
               br(),
               verbatimTextOutput(NS(id, "Otext_debug")),
               br(),
               fixedRow(
                 column(6, plotlyOutput(NS(id, "Oplot_ftimp_rf"), height = 700) %>%
                          withSpinner(color="#5b7d7c")),
                 column(6, plotlyOutput(NS(id, "Oplot_ftimp_b"), height = 700) %>%
                          withSpinner(color="#5b7d7c"))
               )
             )
             )
  )
}

feat_selectServer <- function(id, final_listings, return_val1){
  moduleServer(id, function(input, output, session){
    set.seed(1234)
    
    var_list_num <- final_listings %>%
      keep(is.numeric) %>%
      names() %>%
      str_sort()
    
    # # for debugging, this will print out in console
    # observe({
    #   msg <- sprintf(var_list_num)
    #   cat(msg, "\n")
    # })
    
    observe({
      updateMultiInput(
      session = session,
      inputId = "Inum_vars_corr",
      choices = var_list_num)
    })
    
    observeEvent(input$btn_all_num, {
      updateMultiInput(
        session = session,
        inputId = "Inum_vars_corr",
        selected = var_list_num
      )
    })
    
    observeEvent(input$btn_des_all_num, {
      updateMultiInput(
        session = session,
        inputId = "Inum_vars_corr",
        selected = character(0)
      )
    })
    
    output$Oplot_corrmat <- renderPlotly(NULL)
    output$Oplot_ftimp_b <- renderPlotly(NULL)
    output$Oplot_ftimp_rf <- renderPlotly(NULL)
      
    observeEvent(input$btn_corrplot, {
      validate(
        need(length(input$Inum_vars_corr)>1, 'Please select more variables')
      )
      listing_prep2_num <- final_listings %>%
        select(input$Inum_vars_corr)
      
      corM <- cor(listing_prep2_num,
                  use = "pairwise.complete.obs",
                  method = tolower(input$Icorr_type))
      
      msg <- sprintf(as.character(dim(corM)))
      cat(msg, "\n")
      
      p_mat <- cor_pmat(listing_prep2_num)
      
      corM[upper.tri(corM)] <- NA
      p_mat[upper.tri(p_mat)] <- NA
      
      mlt_cor <- melt(corM, value.name = "Correlation")
      mlt_p <- melt(p_mat, value.name = "pValue")
      mlt_df <- merge(mlt_cor, mlt_p)
      
      mlt_df_x <- mlt_df %>%
        na.omit() %>%
        filter(pValue > input$Isig_lvl_corr)
      
      gheat <- ggplot(NULL, aes(Var1, Var2, fill = Correlation,
                                text = paste0(Var1," - ", Var2, "\n",
                                              "Correlation: ", round(Correlation, 3),
                                              "\nP-val: ", round(pValue, 3)))) +
        geom_tile(data = mlt_df) + 
        scale_fill_gradient2(low = "blue", high = "red", mid = "white",
                             midpoint = 0, limit = c(-1,1),
                             name=paste0(input$Icorr_type,"\nCorrelation"))
      
      len_var <- length(input$Inum_vars_corr)
      if (len_var <= 20){
        gheat <- gheat +
          geom_text(data = mlt_df, aes(Var1, Var2,
                                       label = round(Correlation, 1)), size = 3)
      }
      
      gx <- gheat + 
        geom_point(data = mlt_df_x, shape=4, size=1.5,
                   stroke=0.1, fill=NA, color="black") +
        scale_shape_identity() +
        theme(axis.text.x = element_text(angle = 45, vjust = 0.5, hjust=1, size = 7),
              axis.text.y = element_text(size = 7),
              axis.title.x = element_blank(),
              axis.title.y = element_blank(),
              panel.grid.major = element_blank(),
              panel.border = element_blank(),
              panel.background = element_blank(),
              axis.ticks = element_blank(),
              legend.title = element_text(size = 7),
              legend.text = element_text(size = 6))
      
      output$Oplot_corrmat <- renderPlotly({
        ggplotly(gx, tooltip=c('text'))
        })
      })
    
    ############### feature importance ############### 
    
    observeEvent(input$btn_get_ftimp,{
      validate(
        need(length(return_val1$datasplit())>1,
             'Please go through data splitting process')
      )
      
      listing_train <- training(return_val1$datasplit()) %>%
        na.omit() %>%
        select(-id)

      f <- as.formula(paste(return_val1$targetvar(), "~ ."))

      # output$Otext_debug <- renderText(f)
      
      rf_res1 <- ranger::ranger(f, data = listing_train,
                                importance = "permutation")

      rf_p <- ranger::importance(rf_res1) %>%
        enframe("Variable", "Importance") %>%
        mutate(Variable = fct_reorder(Variable, Importance)) %>%
        arrange(desc(Importance)) %>%
        ggplot(aes(x = Variable, y = Importance,
                   text = paste0(Variable, "\nImportance:", round(Importance,3)))) +
        geom_col() +
        coord_flip() +
        scale_fill_viridis_d(end = .7) +
        labs(title = "Feature Importance (RF)") +
        theme(plot.title = element_text(size = 10),
              axis.title.y = element_blank())

      output$Oplot_ftimp_rf <- renderPlotly(
        ggplotly(rf_p, tooltip = c('text')))

      # Feature importance using boruta
      boruta_output <- Boruta(f, data = listing_train,
                              maxRuns = 50,
                              doTrace = 0)

      boruta_output_tbl <- as.data.frame(boruta_output$ImpHistory) %>%
        gather()

      fac <- with(boruta_output_tbl, reorder(key, value, median, order = TRUE))
      boruta_output_tbl$key <- factor(boruta_output_tbl$key, levels = levels(fac))

      boruta_p <- boruta_output_tbl %>%
        filter(!str_detect(key, 'shadow')) %>%
        ggplot(aes(x = key, y = value)) +
        geom_boxplot() +
        coord_flip() +
        labs(title = "Feature Importance (Boruta)") +
        ylab("Importance") +
        theme(plot.title = element_text(size = 10),
              axis.title.y = element_blank())
      ggplotly(boruta_p)

      output$Oplot_ftimp_b <- renderPlotly(
        ggplotly(boruta_p))

    })
    
    ############################################
    })
}
