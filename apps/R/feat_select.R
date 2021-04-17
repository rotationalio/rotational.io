#' Feature selection
#'
#' @param id, character used to specify namespace, see \code{shiny::\link[shiny]{NS}}
#'
#' @return a \code{shiny::\link[shiny]{tagList}} containing UI elements
#' 

feat_selectUI <- function(id){
  fluidPage(
    sidebarLayout(
      sidebarPanel(
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
        , width = 3),
      mainPanel(
        multiInput(
          inputId = NS(id, "Inum_vars_corr"),
          label = "Choose from numeric variables :",
          choices = character(0),
          width = "900px"),
        
        actionButton(NS(id, "btn_all_num"), "Select all"),
        actionButton(NS(id, "btn_des_all_num"), "Deselect all"),
        plotlyOutput(NS(id, "Oplot_corrmat"))
        , width = 9)
    )
  )
}

feat_selectServer <- function(id, final_listings, listing_split){
  moduleServer(id, function(input, output, session){
    set.seed(1234)
    
    var_list_num <- final_listings %>%
      keep(is.numeric) %>%
      names()
    
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
    
    observeEvent(input$btn_corrplot, {
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
    })
}
