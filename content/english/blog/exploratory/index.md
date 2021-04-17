---
title: Exploratory - prototype test
date: '2021-04-10'
slug: exploratory
categories: exploratory
tags: exploratry
image_webp: images/blog/exploratory/exploratory.webp
image: images/blog/exploratory/exploratory.jpg
draft: no
output:
  blogdown::html_page:
    keep_md: yes
always_allow_html: true

---




# Prototype testing for the Exploratory module for OurShinyPET

This was written as part of the requirements for the Visual Analytics module for MITB.

by [Su Yiin Ang](https://suyiinang.netlify.app/)

---

## 1. Introduction

#### 1.1 Overview of application

The increasing availability of data has resulted in increased demand for data driven decisions. Although there is an extensive range of commercial statistical tools, they are often subscription-based and demand good technical knowledge to mine and draw insights from. Therefore, it may not appeal to the average user.

The `Shiny` package of R provides an interface to build interactive web applications using R language. Furthermore, Shiny provides for fully interactive visualisation with its reactive functions, while retaining the statistical framework of R.

Here, we aim to develop an application that is **user-friendly and interactive** [R Shiny](https://shiny.rstudio.com/) that would enable everyone to make data based decisions **without** needing programming, statistical backgrounds or expensive subscriptions.  

We have selected Airbnb data as a base case given its extensive data (i.e location, pricing, host status, etc.). With this application, users (host, visitors) can analyse their needs to compare across other listings. There are three parts to this shiny application - Text Mining, Exploratory and Confirmatory, and Predictive Analytics. 


#### 1.2 Objective of this report

This report covers the **Exploratory and Confirmatory Analysis module**.

The objectives of this report are to

i) identify and select the appropriate R packages for the final R shiny application,  
ii) develop prototypes of the module, and  
iii) prepare storyboard sketch for the sub-module design.  

During prototype testing, 3 aspects were taken into consideration:

i) interactivity
ii) statistical testing
iii) compatibility with R Shiny

## 2. Literature review

Prior to building our prototype, we examined two applications as part of our literature review. We examined how the analyses were performed in relation to interactive web approach and visual analytics techniques and gaps both in the applications.

The [Radiant](https://vnijs.shinyapps.io/radiant/?_ga=2.97157535.1465001607.1617910198-1515208298.1617518733&SSUID=71147ad3f8) Shiny application developed by [Vincent Nijs](https://rady.ucsd.edu/people/faculty/nijs/) is a powerful interface for business analytics using R. The two modules - _radiant.data_ and _radiant.basic_ offerss tools to visualise and perform statistical analysis. Radiant utilises the `ggplot2` package for visualisation and R's stats package for statistical testing. For _radiant.data_ pivot tab, users are able to create a wide range of **static** charts with the given selections. While for the _radiant.basics_ module, users are expected to have a **basic understanding of statistical testing methods** as they are first required to select their testing method before proceeding. Furthermore, the statistical testing and visualisation are done separately, hence users are not able to visualise and perform inferential statistics on one page.

Meanwhile, the [MEPHAS](https://alain003.phs.osaka-u.ac.jp/mephas/#) Shiny application by Zhou, Y., Leung, Sw., Mizutani, S. et al. (2020) is an integrated web application for statistical analysis to support medical and pharmaceutical analysis. To overcome the statistical knowledge hurdle, the MEPHAS application has an interactive user friendly flow chart that helps user find the right statistical method. The list of statistical test and visualisations covered are extensive, and the process flow is logical and easy to understand to an average user. Furthermore, MEPHAS has seamlessly integrated interactivity for both the visual plots and statistical outputs. However, different statistical test methods are located on web server, i.e parametric t test on [this webpage](https://alain003.phs.osaka-u.ac.jp/mephas_web/2MFSttest/) and non-parametric t-test on [this webpage](https://alain003.phs.osaka-u.ac.jp/mephas_web/3MFSnptest/). Hence, the **transition** from one testing method to another is relatively more **tedious with regards to user experience**.

Taking the two applications into consideration, our application intends to enhance user experience by incorporating interactivity to the graph, automating statistical testing that caters to the average user with a minimal statistical background, and presenting statistical test and interactive graph in a single tab that would enhance visual experience.

## 3 Extracting, wrangling and preparing the input data 

Listings of Airbnbs in Singapore were extracted from [InsideAirbnb.com](http://insideairbnb.com/get-the-data.html)

**3.1 Load packages**  

We will focus on utilising packages from the [`Tidyverse`](https://www.tidyverse.org/) family.

The following packages were mainly used in exploring and developing our prototype.  
- [`readr`](https://readr.tidyverse.org/), [`tibble`](https://tibble.tidyverse.org/), [`dplyr`](https://dplyr.tidyverse.org/), [`tidyr`](https://tidyr.tidyverse.org/) to load, process and prepare data for final exploration.   
- [`ggplot2`](https://ggplot2.tidyverse.org/index.html) to create exploratory plots.  
- [`plotly`](https://plotly.com/r/) to create interactive plots for exploratory analysis.   
- [`ggstatsplot`](https://indrajeetpatil.github.io/ggstatsplot/index.html) to create plots with statistical tests included within plot.  


```{.r .fold-show}
packages = c('tidyverse', 'ggplot2', 'skimr', 'naniar', 'kableExtra','dplyr', 'ggstatsplot','plotly',
             'readr','haven','funModeling','crosstalk','data.table', 'skimr', 'ggmosaic','ggExtra','ggpubr',
             'sf','tmap','sp', 'leaflet','widgetframe')

for(p in packages){
  if(!require(p, character.only = T)){
    install.packages(p)
  }
  library(p, character.only = T)
}
```

**3.2 Load data**

The data was loaded using `read_csv()` of the readr package, which reads delimited files into a `tibble`.


```{.r .fold-show}
listings <- read_csv("./data/raw/listings.csv")
```

**View data**    

The dataset has 4,255 observations and 74 variables.  
At the intial glimpse, we noticed a number of redundant variables such as _id_, _listing_url_, etc. These should be removed as they do not add value to any analysis.  

Further, textual variables such as _description_, _name_ etc, were removed these will be done in the Text Mining module. To the extent useful, textual data was converted to structured data through feature engineering (length of text).  

Additionally, we noticed that some variables are in the wrong data type - _price_, _host_response_rate_, _host_acceptance_rate_ are in character format, when they should be numerical.  


```{.r .fold-show}
glimpse(listings)
```

```
## Rows: 4,255
## Columns: 74
## $ id                                           <dbl> 49091, 50646, 56334, 7160~
## $ listing_url                                  <chr> "https://www.airbnb.com/r~
## $ scrape_id                                    <dbl> 2.021013e+13, 2.021013e+1~
## $ last_scraped                                 <date> 2021-01-27, 2021-01-28, ~
## $ name                                         <chr> "COZICOMFORT LONG TERM ST~
## $ description                                  <chr> "<b>The space</b><br />Th~
## $ neighborhood_overview                        <chr> NA, "The serenity & quiet~
## $ picture_url                                  <chr> "https://a0.muscache.com/~
## $ host_id                                      <dbl> 266763, 227796, 266763, 3~
## $ host_url                                     <chr> "https://www.airbnb.com/u~
## $ host_name                                    <chr> "Francesca", "Sujatha", "~
## $ host_since                                   <date> 2010-10-20, 2010-09-08, ~
## $ host_location                                <chr> "Singapore", "Singapore, ~
## $ host_about                                   <chr> "I am a private tutor by ~
## $ host_response_time                           <chr> "within a few hours", "a ~
## $ host_response_rate                           <chr> "100%", "0%", "100%", "10~
## $ host_acceptance_rate                         <chr> "N/A", "N/A", "N/A", "100~
## $ host_is_superhost                            <lgl> FALSE, FALSE, FALSE, FALS~
## $ host_thumbnail_url                           <chr> "https://a0.muscache.com/~
## $ host_picture_url                             <chr> "https://a0.muscache.com/~
## $ host_neighbourhood                           <chr> "Woodlands", "Bukit Timah~
## $ host_listings_count                          <dbl> 2, 1, 2, 8, 8, 8, 8, 6, 1~
## $ host_total_listings_count                    <dbl> 2, 1, 2, 8, 8, 8, 8, 6, 1~
## $ host_verifications                           <chr> "['email', 'phone', 'face~
## $ host_has_profile_pic                         <lgl> TRUE, TRUE, TRUE, TRUE, T~
## $ host_identity_verified                       <lgl> TRUE, TRUE, TRUE, TRUE, T~
## $ neighbourhood                                <chr> NA, "Singapore, Singapore~
## $ neighbourhood_cleansed                       <chr> "Woodlands", "Bukit Timah~
## $ neighbourhood_group_cleansed                 <chr> "North Region", "Central ~
## $ latitude                                     <dbl> 1.44255, 1.33235, 1.44246~
## $ longitude                                    <dbl> 103.7958, 103.7852, 103.7~
## $ property_type                                <chr> "Private room in apartmen~
## $ room_type                                    <chr> "Private room", "Private ~
## $ accommodates                                 <dbl> 1, 2, 1, 6, 3, 3, 6, 2, 1~
## $ bathrooms                                    <lgl> NA, NA, NA, NA, NA, NA, N~
## $ bathrooms_text                               <chr> "1 bath", "1 bath", "1 ba~
## $ bedrooms                                     <dbl> 1, 1, 1, 2, 1, 1, 1, 1, 1~
## $ beds                                         <dbl> 1, 1, 1, 3, 1, 2, 7, 1, 1~
## $ amenities                                    <chr> "[\"Washer\", \"Elevator\~
## $ price                                        <chr> "$80.00", "$80.00", "$66.~
## $ minimum_nights                               <dbl> 180, 90, 6, 90, 90, 90, 1~
## $ maximum_nights                               <dbl> 360, 730, 14, 1125, 1125,~
## $ minimum_minimum_nights                       <dbl> 180, 90, 6, 90, 90, 90, 1~
## $ maximum_minimum_nights                       <dbl> 180, 90, 6, 90, 90, 90, 1~
## $ minimum_maximum_nights                       <dbl> 360, 730, 14, 1125, 1125,~
## $ maximum_maximum_nights                       <dbl> 360, 730, 14, 1125, 1125,~
## $ minimum_nights_avg_ntm                       <dbl> 180.0, 90.0, 6.0, 90.0, 9~
## $ maximum_nights_avg_ntm                       <dbl> 360, 730, 14, 1125, 1125,~
## $ calendar_updated                             <lgl> NA, NA, NA, NA, NA, NA, N~
## $ has_availability                             <lgl> TRUE, TRUE, TRUE, TRUE, T~
## $ availability_30                              <dbl> 30, 30, 30, 30, 30, 30, 3~
## $ availability_60                              <dbl> 60, 60, 60, 60, 60, 60, 6~
## $ availability_90                              <dbl> 90, 90, 90, 90, 90, 90, 9~
## $ availability_365                             <dbl> 365, 365, 365, 365, 365, ~
## $ calendar_last_scraped                        <date> 2021-01-27, 2021-01-28, ~
## $ number_of_reviews                            <dbl> 1, 18, 20, 20, 24, 48, 29~
## $ number_of_reviews_ltm                        <dbl> 0, 0, 0, 0, 0, 0, 0, 0, 2~
## $ number_of_reviews_l30d                       <dbl> 0, 0, 0, 0, 0, 0, 0, 0, 0~
## $ first_review                                 <date> 2013-10-21, 2014-04-18, ~
## $ last_review                                  <date> 2013-10-21, 2014-12-26, ~
## $ review_scores_rating                         <dbl> 94, 91, 98, 89, 83, 88, 8~
## $ review_scores_accuracy                       <dbl> 10, 9, 10, 9, 8, 9, 9, 9,~
## $ review_scores_cleanliness                    <dbl> 10, 10, 10, 8, 8, 9, 8, 9~
## $ review_scores_checkin                        <dbl> 10, 10, 10, 9, 9, 9, 9, 9~
## $ review_scores_communication                  <dbl> 10, 10, 10, 10, 9, 9, 9, ~
## $ review_scores_location                       <dbl> 8, 9, 8, 9, 8, 9, 9, 9, 1~
## $ review_scores_value                          <dbl> 8, 9, 9, 9, 8, 9, 8, 9, 9~
## $ license                                      <lgl> NA, NA, NA, NA, NA, NA, N~
## $ instant_bookable                             <lgl> FALSE, FALSE, FALSE, TRUE~
## $ calculated_host_listings_count               <dbl> 2, 1, 2, 8, 8, 8, 8, 7, 1~
## $ calculated_host_listings_count_entire_homes  <dbl> 0, 0, 0, 0, 0, 0, 0, 1, 0~
## $ calculated_host_listings_count_private_rooms <dbl> 2, 1, 2, 8, 8, 8, 8, 6, 1~
## $ calculated_host_listings_count_shared_rooms  <dbl> 0, 0, 0, 0, 0, 0, 0, 0, 0~
## $ reviews_per_month                            <dbl> 0.01, 0.22, 0.17, 0.18, 0~
```

**3.3 Remove unnecessary variables**

To avoid having too many variables that would overwhelm the user, we have dropped variables that are not useful for analysis.  


```{.r .fold-show}
listings2 <- listings %>%
  select(-id, -listing_url, -scrape_id, -neighborhood_overview, -picture_url, -host_id, -host_url, -host_name, -host_location,
         -host_thumbnail_url, -host_picture_url, -first_review, -last_review, -last_scraped, -calendar_last_scraped,
         -has_availability, -host_has_profile_pic, -calendar_updated, -license, -bathrooms, -neighbourhood, -host_neighbourhood)
```

**3.4 Create new variables**

**i) Feature engineering - Convert unstructured variables to structured variables**  

Textual variables such as _name_, _description_, _host_about_, _bathroom_text_ , _bathrooms_text_, _host_verifications_count_ were converted into structured variables by counting the length of the text.


```{.r .fold-show}
# convert textual data to structured data
listings3 <- listings2 %>%
  mutate_at(vars(name,description,host_about),str_squish) %>% #remove all whitespaces
  mutate(name_length = str_count(name, ".")) %>% #count characters
  mutate(description_length = str_count(description, ".")) %>%
  mutate(host_about_length = str_count(host_about, ".")) %>%
  select(-name, -description, -host_about)

# convert textual data to structured data
listings3 <- listings3 %>%
  mutate(bathrooms_text = tolower(bathrooms_text)) %>%
  mutate(bathrooms_text = str_replace(bathrooms_text, "half", "0.5")) %>%
  mutate(bathroom = parse_number(bathrooms_text)) %>%
  mutate(bathroom_type = case_when(
    str_detect(bathrooms_text, "private") ~ "Private",
    str_detect(bathrooms_text, "share") ~ "Shared",
    TRUE ~ "Other")
  ) %>%
  select(-bathrooms_text)

# replace amenities with count of amenities
listings3 <- listings3 %>%
  mutate(amenities_count = sapply(str_split(amenities, ","), length)) %>%
  select(-amenities) 

# replace host_verification with count of verification
listings3 <- listings3 %>%
  mutate(host_verifications_count = sapply(str_split(host_verifications, ","), length)) %>%
  select(-host_verifications)
```

**ii) Derive the number of days since a host joined Airbnb platform - _days_joined_**

Using the variable _host_since_, which is in date format,  we have calculated the number of days since the host started hosting Airbnb guests.  


```{.r .fold-show}
listings4 <- listings3 %>%
  mutate(days_joined = as.numeric(as.Date("2021/01/01",
                                           "%Y/%m/%d")-host_since)) %>% 
  select(-host_since)
```

**iii) Derive property type**

The _property_type_ variable comprises both room and property type (e.g. Private room in apartment). We extracted the property type from _property_type_ variable.  


```{.r .fold-show}
# get actual property type (remove room type component) from property_type
listings5 <- listings4 %>%
  mutate(property_type = tolower(property_type)) %>%
  mutate(property_type = case_when(
    grepl(" in ", property_type, fixed = TRUE) == TRUE ~ gsub("^.*in ", "", property_type),
    TRUE ~ gsub("entire ", "", property_type)
  ))
```

**3.5 Change data type**

- Change price-related attribute from _character_ format to _numeric_.  
- Convert character and logical variables to factor data type.  


```{.r .fold-show}
listings5 <- listings5 %>%
  mutate_at(vars(c(contains("price"))), ~as.numeric(str_replace(., "\\$", ""))) %>% #price to numeric
  mutate_at(vars(c(contains("rate"))), ~as.numeric(str_replace(., "\\%", ""))) #rate to numeric
  
#remove listing with $0 price
listings6 <- listings5 %>%
  filter(price!=0)

listings6 <- listings6 %>%
  mutate(across(where(is.character), as.factor)) %>% #convert character to factor
  mutate(across(where(is.logical), as.factor)) #convert logical to factor
```

**3.6 Consolidate similar levels**

For the _host_response_time_ variable, there are 6 levels of which 2 are _N/A_ and _NA_.   
As such, we have renamed _NA_ to _N/A_ as one level.  


```{.r .fold-show}
listings6$host_response_time[is.na(listings6$host_response_time)] <- "N/A"
final_listing <- subset(listings6, !is.na(host_is_superhost))
```

**3.7 View final listing**

Review the final output after wrangling.  


```{.r .fold-show}
glimpse(final_listing)
```

```
## Rows: 4,203
## Columns: 53
## $ host_response_time                           <fct> within a few hours, a few~
## $ host_response_rate                           <dbl> 100, 0, 100, 100, 100, 10~
## $ host_acceptance_rate                         <dbl> NA, NA, NA, 100, 100, 100~
## $ host_is_superhost                            <fct> FALSE, FALSE, FALSE, FALS~
## $ host_listings_count                          <dbl> 2, 1, 2, 8, 8, 8, 8, 6, 1~
## $ host_total_listings_count                    <dbl> 2, 1, 2, 8, 8, 8, 8, 6, 1~
## $ host_identity_verified                       <fct> TRUE, TRUE, TRUE, TRUE, T~
## $ neighbourhood_cleansed                       <fct> Woodlands, Bukit Timah, W~
## $ neighbourhood_group_cleansed                 <fct> North Region, Central Reg~
## $ latitude                                     <dbl> 1.44255, 1.33235, 1.44246~
## $ longitude                                    <dbl> 103.7958, 103.7852, 103.7~
## $ property_type                                <fct> apartment, apartment, apa~
## $ room_type                                    <fct> Private room, Private roo~
## $ accommodates                                 <dbl> 1, 2, 1, 6, 3, 3, 6, 2, 1~
## $ bedrooms                                     <dbl> 1, 1, 1, 2, 1, 1, 1, 1, 1~
## $ beds                                         <dbl> 1, 1, 1, 3, 1, 2, 7, 1, 1~
## $ price                                        <dbl> 80, 80, 66, 174, 80, 80, ~
## $ minimum_nights                               <dbl> 180, 90, 6, 90, 90, 90, 1~
## $ maximum_nights                               <dbl> 360, 730, 14, 1125, 1125,~
## $ minimum_minimum_nights                       <dbl> 180, 90, 6, 90, 90, 90, 1~
## $ maximum_minimum_nights                       <dbl> 180, 90, 6, 90, 90, 90, 1~
## $ minimum_maximum_nights                       <dbl> 360, 730, 14, 1125, 1125,~
## $ maximum_maximum_nights                       <dbl> 360, 730, 14, 1125, 1125,~
## $ minimum_nights_avg_ntm                       <dbl> 180.0, 90.0, 6.0, 90.0, 9~
## $ maximum_nights_avg_ntm                       <dbl> 360, 730, 14, 1125, 1125,~
## $ availability_30                              <dbl> 30, 30, 30, 30, 30, 30, 3~
## $ availability_60                              <dbl> 60, 60, 60, 60, 60, 60, 6~
## $ availability_90                              <dbl> 90, 90, 90, 90, 90, 90, 9~
## $ availability_365                             <dbl> 365, 365, 365, 365, 365, ~
## $ number_of_reviews                            <dbl> 1, 18, 20, 20, 24, 48, 29~
## $ number_of_reviews_ltm                        <dbl> 0, 0, 0, 0, 0, 0, 0, 0, 2~
## $ number_of_reviews_l30d                       <dbl> 0, 0, 0, 0, 0, 0, 0, 0, 0~
## $ review_scores_rating                         <dbl> 94, 91, 98, 89, 83, 88, 8~
## $ review_scores_accuracy                       <dbl> 10, 9, 10, 9, 8, 9, 9, 9,~
## $ review_scores_cleanliness                    <dbl> 10, 10, 10, 8, 8, 9, 8, 9~
## $ review_scores_checkin                        <dbl> 10, 10, 10, 9, 9, 9, 9, 9~
## $ review_scores_communication                  <dbl> 10, 10, 10, 10, 9, 9, 9, ~
## $ review_scores_location                       <dbl> 8, 9, 8, 9, 8, 9, 9, 9, 1~
## $ review_scores_value                          <dbl> 8, 9, 9, 9, 8, 9, 8, 9, 9~
## $ instant_bookable                             <fct> FALSE, FALSE, FALSE, TRUE~
## $ calculated_host_listings_count               <dbl> 2, 1, 2, 8, 8, 8, 8, 7, 1~
## $ calculated_host_listings_count_entire_homes  <dbl> 0, 0, 0, 0, 0, 0, 0, 1, 0~
## $ calculated_host_listings_count_private_rooms <dbl> 2, 1, 2, 8, 8, 8, 8, 6, 1~
## $ calculated_host_listings_count_shared_rooms  <dbl> 0, 0, 0, 0, 0, 0, 0, 0, 0~
## $ reviews_per_month                            <dbl> 0.01, 0.22, 0.17, 0.18, 0~
## $ name_length                                  <int> 33, 31, 11, 35, 30, 26, 3~
## $ description_length                           <int> 1000, 589, 880, 1000, 990~
## $ host_about_length                            <int> 326, 79, 326, 772, 772, 7~
## $ bathroom                                     <dbl> 1.0, 1.0, 1.0, 1.0, 0.5, ~
## $ bathroom_type                                <fct> Other, Other, Other, Priv~
## $ amenities_count                              <int> 7, 12, 8, 25, 21, 16, 22,~
## $ host_verifications_count                     <int> 9, 8, 9, 5, 5, 5, 5, 7, 5~
## $ days_joined                                  <dbl> 3726, 3768, 3726, 3625, 3~
```

## 4. Testing protypes for submodule

### 4.1 Observe variables

This allows users to understand variables available for exploration.


```r
skimDf <- final_listing %>%
  skim_without_charts()

sum_data <- skim(final_listing) %>% summary()

sum_n <-if ("numeric" %in% skimDf$skim_type){
      skimDf %>%
        yank('numeric') %>%
        select('skim_variable','n_missing','complete_rate',
               'mean','sd','p0','p50','p100') %>%
        arrange(-n_missing)
    }
  
sum_f <-if ("factor" %in% skimDf$skim_type){skimDf %>% yank("factor")}

all <- DT::datatable(sum_data)
n <- DT::datatable(sum_n)
f <- DT::datatable(sum_f)


widgetframe::frameWidget(all)
```

```{=html}
<div id="htmlwidget-96b8512db8605f2c48b9" style="width:100%;height:480px;" class="widgetframe html-widget"></div>
<script type="application/json" data-for="htmlwidget-96b8512db8605f2c48b9">{"x":{"url":"index_files/figure-html//widgets/widget_unnamed-chunk-11.html","options":{"xdomain":"*","allowfullscreen":false,"lazyload":false}},"evals":[],"jsHooks":[]}</script>
```

```r
widgetframe::frameWidget(n)
```

```{=html}
<div id="htmlwidget-6d8b46464c1b44436b39" style="width:100%;height:480px;" class="widgetframe html-widget"></div>
<script type="application/json" data-for="htmlwidget-6d8b46464c1b44436b39">{"x":{"url":"index_files/figure-html//widgets/widget_unnamed-chunk-11.html","options":{"xdomain":"*","allowfullscreen":false,"lazyload":false}},"evals":[],"jsHooks":[]}</script>
```

```r
widgetframe::frameWidget(f)
```

```{=html}
<div id="htmlwidget-92c9cf1f9f5fa3d5fdc1" style="width:100%;height:480px;" class="widgetframe html-widget"></div>
<script type="application/json" data-for="htmlwidget-92c9cf1f9f5fa3d5fdc1">{"x":{"url":"index_files/figure-html//widgets/widget_unnamed-chunk-11.html","options":{"xdomain":"*","allowfullscreen":false,"lazyload":false}},"evals":[],"jsHooks":[]}</script>
```


### 4.2 Plotting univariate charts

For univariate exploratory analysis, we would like to be able to plot :  

i) Distribution - through **histogram** for numerical variables and **barplot** for categorical variables,  
ii) Outlier of selected variable - through **boxplot**.   

**4.2.1 Plotting distribution with histogram and bar plots**

**4.2.1.1 With [`ggstatsplot`](https://indrajeetpatil.github.io/ggstatsplot/index.html)**

Upon reading `ggstatsplot` documentation, we realised that `ggbarstats()`, which plots barplots, currently only supports two variable barplots

See extract from the [documentation](https://indrajeetpatil.github.io/ggstatsplot/reference/ggbarstats.html) of the `y` argument. 

> The variable to use as the columns in the contingency table. Please note that if there are empty factor levels in your variable, they will be dropped. Default is `NULL.` If `NULL`, one-sample proportion test (a goodness of fit test) will be run for the `x` variable. Otherwise an appropriate association test will be run. This argument can not be `NULL` for `ggbarstats` function.

Hence the visual below only applicable to numerical variables using `gghistostats`.

`gghistostats` automates the testing methodology based on inputs. Furthermore, `gghistostats` allows adjustments to the confident level and to the statistical approach with 4 options `parametric`, `nonparametric`, `robust` and `bayes`.


```r
set.seed(123) # for reproducibility
g_hist <- gghistostats(
    data = final_listing,
    x = review_scores_rating, 
    title = paste('Distribution of review_scores_rating'),
    normal.curve = TRUE,
    normal.curve.args = list(color = "#00A699", size = 1),
    bar.fill = '#FF5A5F', #use airbnb colour
    ggtheme = ggplot2::theme_classic(),
    type = 'parametric',
    conf.level = 0.95,
    )
g_hist
```

<img src="index_files/figure-html/unnamed-chunk-12-1.png" width="672" />

**Attempt to add interactivity to [`ggstatsplot`](https://indrajeetpatil.github.io/ggstatsplot/index.html) chart using [`ggplotly`](https://plotly.com/ggplot2/)**

We tried to wrap the `ggstatsplot` chart with `ggplotly()`. However by doing so, we would lose key metrics such as the fitted normal curve and statistical test results. As clarified by the author [here](https://github.com/IndrajeetPatil/ggstatsplot/issues/403), this is a [`ggplot2`](https://ggplot2.tidyverse.org/reference/index.html) issue.


```r
histly <- ggplotly(g_hist)
widgetframe::frameWidget(histly)
```

```{=html}
<div id="htmlwidget-95c650e820fb6c175603" style="width:100%;height:480px;" class="widgetframe html-widget"></div>
<script type="application/json" data-for="htmlwidget-95c650e820fb6c175603">{"x":{"url":"index_files/figure-html//widgets/widget_unnamed-chunk-13.html","options":{"xdomain":"*","allowfullscreen":false,"lazyload":false}},"evals":[],"jsHooks":[]}</script>
```


**4.2.1.2 With [`ggplot2`](https://ggplot2.tidyverse.org/reference/index.html)**

To work around `ggstatsplot` limitation while retaining interactivity, we have used `ggplot2` to visualise the variables and included computed statistical test below. However, we are unable to retain the fitted normal curve. We will remove the fit normal curve code from our final shiny application.   

For the statistical tests, we have assumed normality as our dataset has 4000+ observations. Hence, we will use the  
- Single mean `t.test()` for numerical variables to compare a single mean to the mean value of the population.  
- Single proportion `prop.test()` for categorical variables to compare a single proportion to the population   proportion.

From the histogram and test results, _review_scores_rating_ are left-skewed with mean of 91.4 and median 95. 


```r
hist <- ggplot(final_listing, aes(x = review_scores_rating)) + 
  ggtitle("Distribution of review_scores_rating") +
  xlab('review_scores_rating') + 
  theme_bw() +
  geom_histogram(bins = 10,
                 color = '#767676',
                 fill = '#FF5A5F', 
                 aes(y=..density.., 
                     fill=..count..), 
                    alpha=0.5) +
  stat_function(fun = dnorm, 
                args = list(mean = mean(final_listing$review_scores_rating), 
                            sd = sd(final_listing$review_scores_rating))) + #normal curve doesn't appear
  geom_vline(aes(xintercept=mean(final_listing$review_scores_rating,na.rm=T)),
             color="#00A699", 
             linetype="dashed", 
             size=1)+ 
  geom_vline(aes(xintercept=median(final_listing$review_scores_rating,na.rm=T)),
             color="#484848", 
             linetype="dashed", 
             size=1)


bar <- ggplot(final_listing, aes(x = room_type)) + 
  ggtitle("Distribution of room_type") +
  xlab('room_type') + 
  theme_bw() + 
  geom_histogram(stat = 'count',
                       color = '#767676',
                          fill = '#FF5A5F')
   

histly2 <- ggplotly(hist)
widgetframe::frameWidget(histly2)
```

```{=html}
<div id="htmlwidget-1ce218b09494c0650f5f" style="width:100%;height:480px;" class="widgetframe html-widget"></div>
<script type="application/json" data-for="htmlwidget-1ce218b09494c0650f5f">{"x":{"url":"index_files/figure-html//widgets/widget_unnamed-chunk-14.html","options":{"xdomain":"*","allowfullscreen":false,"lazyload":false}},"evals":[],"jsHooks":[]}</script>
```

```r
t.test(final_listing$review_scores_rating,mu = 100, alternative = 'two.sided',conf.level = 0.95)
```

```
## 
## 	One Sample t-test
## 
## data:  final_listing$review_scores_rating
## t = -37.452, df = 2468, p-value < 2.2e-16
## alternative hypothesis: true mean is not equal to 100
## 95 percent confidence interval:
##  91.01510 91.90916
## sample estimates:
## mean of x 
##  91.46213
```

**4.2.2 Plotting outliers with boxplot**

[`ggstatsplot`](https://indrajeetpatil.github.io/ggstatsplot/index.html) currently doesn't not have any graph to plot a single variable boxplot for outlier observations. As such, I have used [`ggplotly()`](https://plotly.com/ggplot2/) and [`ggplot2`](https://ggplot2.tidyverse.org/reference/index.html)  to create and interactive chart. 

Here we observe that the outliers are those less than 70.


```r
boxchart <- ggplot(final_listing, 
                   aes(x = '', 
                       y = review_scores_rating, 
                       colour = '#FF5A5F')) +
  geom_boxplot() +
  coord_flip() +
  stat_boxplot(geom ='errorbar') +
  stat_summary(fun.y=mean, geom="point", shape=5, size=4)+ 
  labs(title = "Outlier boxplot using ggplot and ggplotly") +
  xlab('review_scores_rating') +
  theme_classic() +
  theme(legend.position = 'none')
  
boxly <- ggplotly(boxchart)
widgetframe::frameWidget(boxly)
```

```{=html}
<div id="htmlwidget-4fa2d3121c2f4c602e93" style="width:100%;height:480px;" class="widgetframe html-widget"></div>
<script type="application/json" data-for="htmlwidget-4fa2d3121c2f4c602e93">{"x":{"url":"index_files/figure-html//widgets/widget_unnamed-chunk-15.html","options":{"xdomain":"*","allowfullscreen":false,"lazyload":false}},"evals":[],"jsHooks":[]}</script>
```


### 4.3 Bivariate exploratory and confirmatory analysis

For bivariate analysis, we would like to be able to plot 3 main types of interactions between variables - 

- 2 numerical variables - Scatterplot 

- 2 categorical variables - mosaic plot

- 1 numerical and 1 categorical - box/violin plot

 
**4.3.1 Plotting numerical variables with scatterplot**

**4.3.1.1 With `ggMarginal()`**

`ggMarginal()` of the `ggExtra` package adds marginal plots to `ggplot2` by wrapping over the existing `ggplot2` chart. It is very quick and easy way of plotting marginal plots of existing `ggplot2` charts. However we noted that the chart does not with plotly.


```r
p1 <- ggplot(final_listing, 
             aes(host_listings_count, review_scores_rating, colour = host_is_superhost)) +
               geom_point()

p2<-ggMarginal(p1, groupColour = TRUE, groupFill = TRUE)
p2
```

<img src="index_files/figure-html/unnamed-chunk-16-1.png" width="672" />


**4.3.1.2 With [`ggstatsplot`](https://indrajeetpatil.github.io/ggstatsplot/index.html)**

`ggscatterstats` is able to replicate `ggMarginal()` chart overlayed with statistical test.


```r
scatterstats <- ggscatterstats(
        data = final_listing,
        x = review_scores_rating, 
        y = amenities_count, 
        conf.level = 0.95,
        xlab = "Review_scores_rating",
        ylab = "amenities_count",
        marginal.type = 'density',
        title = 'Scatterplot of using ggstatsplot')
scatterstats
```

<img src="index_files/figure-html/unnamed-chunk-17-1.png" width="672" />



Furthermore, `ggsctterstats` allows for group visualisation and testing of selected factor, simply by changing a few lines to the existing code above. This package also allows for different marginal charts by changing the _marginal.type_. 


```r
g_sct <- grouped_ggscatterstats( #changed this
  data = final_listing,
  x = review_scores_rating, 
  y = amenities_count, 
  grouping.var = host_is_superhost, #added this
  conf.level = 0.95,
  type = 'pearson',
  xlab = "Review_scores_rating",
  ylab = "amenities_count",
  marginal.type = 'boxplot', #boxplot instead of density
plot.grid.args = list(nrows =1, ncol = 2)) #to view in one row
g_sct
```

<img src="index_files/figure-html/unnamed-chunk-18-1.png" width="672" />



**4.3.1.3 using [`ggplot2`](https://ggplot2.tidyverse.org/reference/index.html) and [`ggplotly()`](https://plotly.com/ggplot2/)**

By using `facet_wrap()` and `ggplotly()`, we can plot an interactive chart grouped by selected factor (i.e _host_is_superhost_). However correlation test must be done separately for these two groups (superhost and non-superhost), which may be difficult to implement in shiny given that different variables have different number of factor levels. 

The correlation results below is a combined test of superhost and non-superhost. We observed that the p-value generated by `cor.test` is the same as the p-value generated by `ggscatterstats`.


```r
scatter <- ggplot(final_listing, aes(x = review_scores_rating, y= amenities_count)) +
  geom_point(aes(fill = host_is_superhost)) +
  geom_smooth(method = 'lm', se = FALSE) + 
  facet_wrap(vars(host_is_superhost)) + 
  ggtitle('Scatterplot using ggplot2')

scatterly <- ggplotly(scatter)
widgetframe::frameWidget(scatterly)
```

```{=html}
<div id="htmlwidget-f048ab3903cf5fe7225b" style="width:100%;height:480px;" class="widgetframe html-widget"></div>
<script type="application/json" data-for="htmlwidget-f048ab3903cf5fe7225b">{"x":{"url":"index_files/figure-html//widgets/widget_unnamed-chunk-19.html","options":{"xdomain":"*","allowfullscreen":false,"lazyload":false}},"evals":[],"jsHooks":[]}</script>
```

```r
cor.test(final_listing$review_scores_rating, final_listing$amenities_count, conf.level = 0.95)
```

```
## 
## 	Pearson's product-moment correlation
## 
## data:  final_listing$review_scores_rating and final_listing$amenities_count
## t = 6.9507, df = 2467, p-value = 4.636e-12
## alternative hypothesis: true correlation is not equal to 0
## 95 percent confidence interval:
##  0.09968637 0.17706953
## sample estimates:
##       cor 
## 0.1385895
```



**4.3.2 Plotting categorical variables - Mosaic plot**

**4.3.2.1 With [`ggstatsplot`](https://indrajeetpatil.github.io/ggstatsplot/index.html)**


```r
barstat <- ggbarstats(data = final_listing,
               x = host_is_superhost, 
               y = room_type, 
               title = paste('Mosaic plot using ggstatsplot'),
               type = 'parametric',
               conf.level = 0.95,
               proportion.test = TRUE,
               ggtheme = ggplot2::theme_classic())
barstat
```

<img src="index_files/figure-html/unnamed-chunk-20-1.png" width="672" />


**4.3.2.2 Using [`ggmosaic`](https://haleyjeppson.github.io/ggmosaic/), [`ggplot2`](https://ggplot2.tidyverse.org/reference/index.html) and [`ggplotly()`](https://plotly.com/ggplot2/)**


```r
m <- ggplot(final_listing) + 
  geom_mosaic(aes(x=  product(host_is_superhost, room_type), 
              fill = host_is_superhost)) + 
    labs(
      title = paste("Mosaic plot using ggmosaic and plotly"),
      x = 'room_type',
      y = 'host_is_superhost') +
    theme(axis.text.y=element_blank(),
        axis.ticks.y=element_blank(),
        axis.text.x = element_text(angle = 90))

## chisq test
chisq <- chisq.test(x = final_listing$host_is_superhost,y = final_listing$room_type)

#output
mly <- ggplotly(m)
widgetframe::frameWidget(mly)
```

```{=html}
<div id="htmlwidget-6e1d9ec3ab6555ea32b1" style="width:100%;height:480px;" class="widgetframe html-widget"></div>
<script type="application/json" data-for="htmlwidget-6e1d9ec3ab6555ea32b1">{"x":{"url":"index_files/figure-html//widgets/widget_unnamed-chunk-21.html","options":{"xdomain":"*","allowfullscreen":false,"lazyload":false}},"evals":[],"jsHooks":[]}</script>
```

```r
chisq
```

```
## 
## 	Pearson's Chi-squared test
## 
## data:  final_listing$host_is_superhost and final_listing$room_type
## X-squared = 49.379, df = 3, p-value = 1.083e-10
```
 

**4.3.3 Plotting numerical and categorical variabes - Box and violin plot** 

**4.3.3.1 Using [`ggstatsplot`](https://indrajeetpatil.github.io/ggstatsplot/index.html)**


```r
betstat <- ggbetweenstats(
      data = final_listing,
      x = 'host_is_superhost', 
      y = 'price', 
      title = 'Violin plot using ggstatsplot',
      type = 'parametric',
      conf.level = 0.95,
      pairwise.comparisons = TRUE,
      pairwise.display = 'significant', 
      p.adjust.method = 'holm', 
      ggtheme = ggplot2::theme_classic()
    )
betstat
```

<img src="index_files/figure-html/unnamed-chunk-22-1.png" width="672" />



**4.3.3.2 Using [`ggplot2`](https://ggplot2.tidyverse.org/reference/index.html) and [`ggplotly()`](https://plotly.com/ggplot2/)**

Here we used `ggpubr` function of `stat_compare_means()` to include the p-value into the interactively chart. Similarly, we have cross checked the p-value to the `t.test` and `ggbetweenstats` to ensure that all the results are consistent. Here, the p-value is > 0.05, this means that the average price difference between host and superhost is significant.

In our example below, the categorical variable has 2 levels, hence the `t.test` was used.

For categorical variables with more than 2 levels, the anova test will be used using `anova_test()`. Should the `anova_test()` be significant, the `tukey_hsd()` will be perform to show where the differences lie.


```r
base <- ggplot(final_listing, aes(host_is_superhost, y = price)) + 
    labs(
      title = 'Boxplot and violin plot using ggplot2',
      x = 'host_is_superhost',
      y = 'price')

bbox <- geom_boxplot(aes(fill = host_is_superhost),outlier.shape = NA)

box <- base + bbox + stat_compare_means(method = 't.test')

boxly <- ggplotly(box)

widgetframe::frameWidget(boxly)
```

```{=html}
<div id="htmlwidget-4c248f26364c86ae7058" style="width:100%;height:480px;" class="widgetframe html-widget"></div>
<script type="application/json" data-for="htmlwidget-4c248f26364c86ae7058">{"x":{"url":"index_files/figure-html//widgets/widget_unnamed-chunk-23.html","options":{"xdomain":"*","allowfullscreen":false,"lazyload":false}},"evals":[],"jsHooks":[]}</script>
```

```r
t.test(price ~ host_is_superhost, final_listing, var.equal = FALSE)
```

```
## 
## 	Welch Two Sample t-test
## 
## data:  price by host_is_superhost
## t = -0.59367, df = 1100.4, p-value = 0.5529
## alternative hypothesis: true difference in means is not equal to 0
## 95 percent confidence interval:
##  -11.557634   6.188317
## sample estimates:
## mean in group FALSE  mean in group TRUE 
##            135.7682            138.4529
```



### 4.4 Mapping Airbnb

#### 4.4.1 Point symbol map

Point symbol maps displays each listing as a point. We have used the `tmap` and `leaflet` during our prototype testing.

**4.4.1.1 With `tmap`**

Subzone boundaries were extract from [data.gov.sg](https://data.gov.sg/dataset/master-plan-2014-subzone-boundary-web), which were used to draw the boundaries within Singapore.

`tmap` allows for customisation (i.e title, facet by select factor, etc.). `tmap` can be made interactive by calling the `tmap_mode('view')` function, which we have shown in the chloropleth map below. Furthermore, `tmap` can be used with [shiny](https://rdrr.io/cran/tmap/man/renderTmap.html) through the `renderTmap` wrapper.


```r
#load subzone data
mpsz <- st_read(dsn = 'data/spatial',
                layer = 'MP14_SUBZONE_WEB_PL',
                crs = 3414) 
```

```
## Reading layer `MP14_SUBZONE_WEB_PL' from data source `E:\suyiinang\shinyPET\content\english\blog\exploratory\data\spatial' using driver `ESRI Shapefile'
## Simple feature collection with 323 features and 15 fields
## Geometry type: MULTIPOLYGON
## Dimension:     XY
## Bounding box:  xmin: 2667.538 ymin: 15748.72 xmax: 56396.44 ymax: 50256.33
## Projected CRS: SVY21 / Singapore TM
```

```r
#transform
singapore <- st_transform(mpsz, 4326)

#convert long lat to sf object
final_listing_exN <- subset(final_listing, !is.na(host_is_superhost))
listings_sf <- st_as_sf(final_listing_exN,
                        coords = c('longitude', 'latitude'),
                        crs = 4326) %>%
  st_transform(crs = 3414)

#plot map
p_map <-tm_shape(mpsz) + 
  tm_polygons() + 
  tm_shape(listings_sf) +
  tm_bubbles(col = 'host_is_superhost', 
             size = 'price',
             border.col = 'black',
             border.lwd = 1,
             alpha = 0.8)+
  tm_facets(by='host_is_superhost',
            nrow = 1 ,
            sync = TRUE)+
  tm_layout(main.title = 'Point Symbol map by price and host_is_superhost',
            legend.outside.position = 'bottom',
            legend.stack = 'horizontal') 
p_map
```

<img src="index_files/figure-html/unnamed-chunk-24-1.png" width="672" />
 

**4.4.4.2 With `leaflet`**

Plotting a point symbol map using `leaflet` is relatively easy and straight forward as it uses longitude and latitude.

We need not do a point in polygon mapping, as done for `tmap` above, which maps longitude & latitude/neighbourhood to subzones. Such mapping may not be available for certain countries/areas.


```r
leaf_map <- leaflet(data = final_listing) %>% 
  addTiles() %>% 
  addCircleMarkers(lng = ~longitude,
                   lat = ~latitude,
                   label = ~as.character(final_listing$host_is_superhost),
                   clusterOptions = markerClusterOptions()) 
leaf_map
```

```{=html}
<div id="htmlwidget-42d072f3376a70376667" style="width:672px;height:480px;" class="leaflet html-widget"></div>
<script type="application/json" data-for="htmlwidget-42d072f3376a70376667">{"x":{"options":{"crs":{"crsClass":"L.CRS.EPSG3857","code":null,"proj4def":null,"projectedBounds":null,"options":{}}},"calls":[{"method":"addTiles","args":["//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",null,null,{"minZoom":0,"maxZoom":18,"tileSize":256,"subdomains":"abc","errorTileUrl":"","tms":false,"noWrap":false,"zoomOffset":0,"zoomReverse":false,"opacity":1,"zIndex":1,"detectRetina":false,"attribution":"&copy; <a href=\"http://openstreetmap.org\">OpenStreetMap<\/a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA<\/a>"}]},{"method":"addCircleMarkers","args":[[1.44255,1.33235,1.44246,1.34541,1.34567,1.34702,1.34348,1.31125,1.31698,1.34943,1.3142,1.3115,1.31327,1.29345,1.34838,1.3628,1.34657,1.34816,1.34135,1.33171,1.34153,1.30109,1.30816,1.36743,1.27663,1.27585,1.30416,1.2841,1.39963,1.28342,1.30492,1.30425,1.31313,1.27681,1.28291,1.3123,1.36885,1.28429,1.33334,1.29245,1.33729,1.31189,1.28708,1.31617,1.31503,1.31507,1.2838,1.31213,1.28458,1.2927,1.2927,1.31511,1.28386,1.32889,1.38055,1.30774,1.32359,1.31118,1.28419,1.2841,1.31181,1.39088,1.34126,1.33917,1.30292,1.28405,1.28405,1.28405,1.28466,1.29947,1.2841,1.31266,1.30626,1.34566,1.31742,1.31993,1.34574,1.31539,1.31944,1.32249,1.27539,1.2902,1.32111,1.31963,1.32359,1.38768,1.32347,1.38686,1.32122,1.32423,1.36867,1.31263,1.44076,1.29041,1.3377,1.2942,1.30343,1.31117,1.30699,1.31566,1.29198,1.29893,1.31047,1.36103,1.2986,1.33967,1.31086,1.30997,1.28378,1.28845,1.34948,1.36449,1.28318,1.28458,1.28496,1.28439,1.28424,1.28262,1.28354,1.29533,1.31379,1.30376,1.30171,1.31586,1.31565,1.3471,1.30148,1.31808,1.30348,1.27795,1.28223,1.31995,1.31595,1.28278,1.28332,1.31718,1.31566,1.31512,1.31503,1.32712,1.31025,1.31045,1.30475,1.31503,1.31467,1.29775,1.31617,1.27953,1.38785,1.29561,1.45277,1.30706,1.28305,1.34151,1.28895,1.31118,1.36,1.31161,1.31563,1.29887,1.31102,1.31045,1.28175,1.31658,1.36573,1.45328,1.29929,1.32265,1.37045,1.2851,1.28614,1.33305,1.35349,1.316,1.31114,1.2873,1.31671,1.31232,1.31091,1.30505,1.33199,1.31553,1.37043,1.27546,1.31429,1.28257,1.31105,1.33043,1.27599,1.3151,1.31539,1.28185,1.3032,1.30422,1.30402,1.30376,1.30543,1.30541,1.30386,1.34366,1.31097,1.30197,1.41482,1.27608,1.31614,1.27623,1.3291,1.37935,1.3195,1.31773,1.30953,1.27549,1.31164,1.44201,1.44299,1.44196,1.41594,1.3356,1.29523,1.32028,1.34587,1.38777,1.34495,1.34463,1.31621,1.3212,1.30153,1.31642,1.34471,1.41621,1.3071,1.31137,1.31534,1.3201,1.31934,1.29467,1.35894,1.31394,1.39866,1.32112,1.28504,1.31352,1.29261,1.35613,1.31238,1.42803,1.32958,1.28026,1.2841,1.32234,1.32526,1.31322,1.31644,1.37022,1.29655,1.28315,1.30908,1.29361,1.34507,1.32089,1.43972,1.31452,1.31015,1.32401,1.31702,1.34471,1.313,1.27914,1.30531,1.31683,1.44154,1.30205,1.34399,1.34604,1.31502,1.44151,1.38135,1.33028,1.28376,1.3084,1.30854,1.34764,1.44145,1.29432,1.3144,1.3154,1.30105,1.3149,1.32647,1.30623,1.27832,1.29407,1.31441,1.28684,1.33317,1.32206,1.32292,1.38496,1.44013,1.31957,1.32281,1.3426,1.31746,1.31481,1.31546,1.28425,1.35022,1.38404,1.27718,1.32796,1.29611,1.31373,1.30298,1.30702,1.41016,1.30726,1.29325,1.31743,1.31209,1.40029,1.27439,1.4401,1.31186,1.31138,1.31153,1.32416,1.3155,1.31393,1.30838,1.29614,1.31359,1.30678,1.33316,1.30743,1.3636,1.30852,1.34193,1.3075,1.30787,1.3419,1.31952,1.31587,1.29628,1.31579,1.31849,1.31909,1.31857,1.3172,1.31846,1.31722,1.3168,1.31878,1.29666,1.3404,1.31581,1.28031,1.28042,1.34432,1.30513,1.305,1.30499,1.30475,1.30509,1.28016,1.30573,1.28181,1.44161,1.29478,1.34574,1.29691,1.31137,1.31136,1.31108,1.28017,1.30385,1.30352,1.30526,1.30508,1.30397,1.34726,1.30775,1.35278,1.31617,1.30803,1.37932,1.31662,1.32869,1.28051,1.2834,1.35329,1.32218,1.37957,1.28476,1.28365,1.31241,1.28285,1.28453,1.38118,1.28027,1.28198,1.39021,1.30504,1.30985,1.31147,1.28307,1.34589,1.35282,1.28041,1.32148,1.28337,1.29889,1.28417,1.28598,1.28684,1.28632,1.42591,1.29943,1.31458,1.29464,1.29811,1.33284,1.34866,1.31117,1.3114,1.31169,1.31153,1.31017,1.30988,1.31108,1.34895,1.44152,1.44167,1.31106,1.3522,1.31934,1.28393,1.28455,1.37544,1.27999,1.45287,1.31609,1.37576,1.30999,1.31913,1.28329,1.35634,1.42571,1.31604,1.28582,1.40529,1.28471,1.28778,1.30366,1.31153,1.31169,1.31206,1.30813,1.28294,1.31854,1.31408,1.3129,1.31132,1.31284,1.31232,1.28458,1.31292,1.44005,1.38993,1.31103,1.2866,1.32071,1.42562,1.28816,1.28481,1.42479,1.34411,1.29866,1.28672,1.3114,1.31114,1.31117,1.31155,1.31134,1.31145,1.31114,1.30584,1.31129,1.31114,1.29251,1.31114,1.31114,1.31114,1.29961,1.35534,1.44123,1.30986,1.31311,1.31722,1.31169,1.29558,1.28186,1.36675,1.284,1.31517,1.29939,1.31057,1.37342,1.29943,1.29914,1.30789,1.30956,1.39977,1.29989,1.33203,1.31095,1.32464,1.28432,1.32038,1.33765,1.30264,1.33514,1.29446,1.44347,1.39122,1.31049,1.31137,1.44495,1.44504,1.44466,1.44437,1.36583,1.35039,1.30122,1.32993,1.4295,1.30349,1.31525,1.27996,1.3466,1.34671,1.30083,1.32089,1.37883,1.30534,1.28116,1.3103,1.31161,1.32307,1.3063,1.30221,1.32528,1.32513,1.32551,1.28966,1.295,1.30036,1.32792,1.28427,1.28783,1.28192,1.28202,1.28156,1.31688,1.28052,1.45204,1.36246,1.36248,1.40225,1.30893,1.32005,1.28137,1.34425,1.30011,1.38397,1.28443,1.31027,1.31082,1.2839,1.32893,1.31347,1.38246,1.31292,1.37782,1.31005,1.31005,1.31005,1.31005,1.31005,1.31005,1.31005,1.31005,1.31005,1.31005,1.31005,1.31785,1.30466,1.28379,1.28448,1.28416,1.3176,1.31158,1.29458,1.30216,1.43424,1.36897,1.31768,1.28076,1.31528,1.3462,1.27777,1.30731,1.38802,1.3457,1.35978,1.30225,1.31268,1.2675,1.31672,1.31982,1.31636,1.35,1.29907,1.32745,1.31457,1.34237,1.36005,1.35442,1.35717,1.32381,1.30443,1.32994,1.35584,1.2877,1.28466,1.28379,1.31536,1.3144,1.34308,1.30276,1.30404,1.30299,1.30385,1.31183,1.31696,1.31358,1.29263,1.2841,1.43023,1.32025,1.33906,1.42709,1.42693,1.36864,1.4058,1.30296,1.3084,1.27922,1.35343,1.37258,1.34401,1.40472,1.32103,1.29409,1.31118,1.33837,1.31081,1.28844,1.28676,1.28853,1.29355,1.29355,1.29879,1.32693,1.31019,1.28313,1.32379,1.29381,1.31212,1.31573,1.31902,1.32595,1.2841,1.36485,1.38385,1.3241,1.44136,1.31897,1.27475,1.27406,1.28268,1.3086,1.39259,1.28522,1.29761,1.36984,1.39375,1.31502,1.35582,1.29941,1.28473,1.31124,1.31959,1.31491,1.31132,1.38106,1.30416,1.35934,1.29561,1.32399,1.2841,1.34892,1.31231,1.32345,1.43674,1.31782,1.31186,1.2835,1.28337,1.32234,1.28028,1.28365,1.30537,1.39366,1.31303,1.32372,1.37539,1.4395,1.31675,1.3083,1.30801,1.30873,1.3446,1.35414,1.32728,1.32817,1.2851,1.31573,1.43206,1.35141,1.28351,1.31575,1.31168,1.31061,1.2927,1.3299,1.3126,1.335,1.31215,1.30494,1.35329,1.3078,1.29588,1.31905,1.32488,1.31552,1.31712,1.30839,1.27728,1.31009,1.3568,1.39253,1.30117,1.31326,1.30958,1.31349,1.37771,1.34927,1.31548,1.3443,1.30952,1.31275,1.27735,1.33092,1.3722,1.31867,1.30978,1.32668,1.31018,1.41611,1.30891,1.30535,1.31098,1.31075,1.3178,1.33463,1.32388,1.38131,1.37505,1.44806,1.282,1.2836,1.29197,1.28699,1.31004,1.30481,1.39892,1.26759,1.33966,1.29879,1.29955,1.29737,1.28448,1.28462,1.34468,1.30498,1.3167,1.31173,1.39806,1.31299,1.3136,1.34244,1.3174,1.30501,1.34507,1.27886,1.34257,1.34176,1.31005,1.31005,1.3158,1.31276,1.32397,1.32512,1.32476,1.3168,1.31854,1.32949,1.31252,1.31114,1.39464,1.28333,1.31114,1.32848,1.35595,1.30744,1.31393,1.31009,1.40174,1.32523,1.31515,1.2855,1.27926,1.38636,1.31515,1.31598,1.32835,1.35197,1.31851,1.31394,1.37522,1.27964,1.37589,1.37612,1.27505,1.31871,1.36167,1.31324,1.29865,1.38086,1.28331,1.2845,1.325,1.30743,1.41835,1.31488,1.30953,1.29773,1.44102,1.31262,1.27468,1.43004,1.28382,1.31094,1.29903,1.29771,1.299,1.31077,1.44184,1.30976,1.31114,1.28669,1.28832,1.28723,1.28696,1.28444,1.2866,1.28798,1.28804,1.28636,1.2868,1.28722,1.28827,1.28797,1.28701,1.28692,1.30774,1.29724,1.31338,1.29704,1.44115,1.29943,1.28633,1.44065,1.3068,1.29562,1.32437,1.29806,1.28466,1.38559,1.31005,1.37441,1.29772,1.33869,1.31198,1.30212,1.27437,1.31225,1.44173,1.34033,1.31522,1.31319,1.43141,1.28818,1.28149,1.29615,1.30612,1.34532,1.37944,1.31143,1.27515,1.30938,1.30167,1.31033,1.28436,1.30972,1.3078,1.2813,1.28309,1.2829,1.3035,1.31157,1.3209,1.33863,1.34667,1.30971,1.34702,1.31246,1.30411,1.2926,1.30411,1.30411,1.30411,1.30547,1.32851,1.3161,1.29831,1.29782,1.34336,1.28747,1.31192,1.31785,1.28883,1.28871,1.2887,1.28329,1.31691,1.34576,1.4087,1.30953,1.30193,1.35487,1.30087,1.32079,1.31986,1.31855,1.33522,1.34482,1.28168,1.32556,1.28706,1.28302,1.29787,1.30994,1.27541,1.30785,1.29446,1.32374,1.27317,1.30104,1.29539,1.30931,1.30968,1.30822,1.43195,1.27554,1.30735,1.32891,1.32785,1.44728,1.31873,1.3094,1.31907,1.31825,1.28342,1.31481,1.34525,1.30999,1.2746,1.29779,1.29738,1.40255,1.36883,1.30751,1.27937,1.30246,1.4046,1.29925,1.29529,1.29721,1.30696,1.30696,1.30696,1.31353,1.44503,1.28412,1.31176,1.31948,1.36619,1.32839,1.31851,1.28412,1.28412,1.3741,1.37447,1.28174,1.2813,1.27425,1.27577,1.27613,1.27767,1.27399,1.27456,1.27534,1.27607,1.2754,1.27612,1.29777,1.35734,1.30728,1.2951,1.27719,1.3168,1.37555,1.28412,1.3849,1.32072,1.29399,1.31638,1.28862,1.28719,1.35675,1.38332,1.36747,1.33791,1.34783,1.28172,1.28256,1.30411,1.30411,1.38147,1.3037,1.30378,1.32352,1.31025,1.29779,1.31384,1.28212,1.32491,1.28106,1.32487,1.32304,1.34549,1.3647,1.32727,1.31468,1.3152,1.30981,1.37434,1.31664,1.3101,1.27554,1.30334,1.31426,1.31039,1.27951,1.28343,1.31729,1.32451,1.32356,1.28275,1.28041,1.37678,1.28939,1.32464,1.32505,1.31628,1.28009,1.31354,1.27705,1.3234,1.32336,1.32492,1.32423,1.32437,1.32317,1.32305,1.31021,1.44184,1.31498,1.40224,1.30404,1.30376,1.29191,1.32452,1.31392,1.31502,1.37715,1.28918,1.28852,1.28263,1.28268,1.28316,1.28782,1.3248,1.28854,1.44013,1.31051,1.39574,1.32463,1.32053,1.32252,1.31219,1.44162,1.34249,1.32651,1.34156,1.27619,1.27867,1.27862,1.28063,1.3147,1.31541,1.31539,1.34207,1.3064,1.2892,1.34431,1.3155,1.31437,1.39217,1.31127,1.32889,1.4403,1.28149,1.43998,1.44103,1.44106,1.43985,1.31039,1.31852,1.28467,1.27894,1.30033,1.29614,1.28188,1.3152,1.28434,1.2871,1.2881,1.28767,1.28791,1.28834,1.28715,1.28697,1.28842,1.28627,1.2886,1.28816,1.28768,1.2877,1.28715,1.28835,1.28815,1.28643,1.28687,1.2863,1.28812,1.28696,1.28673,1.28676,1.28823,1.28811,1.28365,1.36438,1.35893,1.28412,1.3614,1.33463,1.32216,1.29592,1.31162,1.31278,1.28589,1.29643,1.31051,1.30207,1.30987,1.31018,1.33281,1.33286,1.29806,1.29806,1.29806,1.29806,1.29806,1.29806,1.37776,1.32168,1.28278,1.28802,1.32693,1.33749,1.28546,1.29448,1.35011,1.28412,1.35765,1.28085,1.31647,1.30272,1.315,1.27538,1.37743,1.29619,1.32536,1.44128,1.30173,1.29885,1.2903,1.27774,1.27973,1.2815,1.31516,1.28455,1.30808,1.33011,1.30076,1.30244,1.3941,1.28744,1.28741,1.27943,1.30416,1.30102,1.38692,1.34265,1.31465,1.29871,1.32524,1.28691,1.39537,1.32701,1.31235,1.3023,1.36896,1.30827,1.35573,1.27838,1.3147,1.32476,1.30392,1.31576,1.2909,1.31646,1.31536,1.31563,1.31496,1.29951,1.29951,1.28463,1.28355,1.38968,1.31472,1.29951,1.29951,1.29951,1.29951,1.29951,1.29951,1.29951,1.29951,1.29951,1.29951,1.29951,1.31249,1.32283,1.28019,1.3122,1.29465,1.31026,1.28449,1.30983,1.30984,1.35095,1.31475,1.31183,1.31836,1.31752,1.32123,1.34263,1.31288,1.28497,1.26678,1.31334,1.36905,1.28449,1.33495,1.28302,1.3175,1.28449,1.3131,1.4109,1.41022,1.41204,1.41227,1.41194,1.31159,1.29051,1.31222,1.31292,1.33356,1.31357,1.31146,1.31233,1.27979,1.30958,1.31265,1.30848,1.28449,1.31259,1.33264,1.3147,1.31074,1.29986,1.29456,1.43237,1.2804,1.32261,1.32383,1.32226,1.32299,1.32262,1.30754,1.31196,1.3063,1.31031,1.31362,1.30825,1.32283,1.29951,1.29683,1.3701,1.29951,1.35675,1.31116,1.29951,1.33636,1.30088,1.27625,1.3028,1.30099,1.30092,1.29742,1.28449,1.34162,1.30854,1.28418,1.29894,1.31175,1.37874,1.30213,1.32999,1.28449,1.31254,1.40131,1.3015,1.308,1.308,1.28449,1.32158,1.29867,1.2976,1.29896,1.27764,1.27567,1.30215,1.31969,1.44429,1.30309,1.31182,1.30942,1.29081,1.30077,1.30074,1.30026,1.29219,1.31515,1.29067,1.30059,1.30126,1.28119,1.29806,1.28449,1.31178,1.30244,1.28086,1.29795,1.28449,1.31226,1.3054,1.30465,1.30351,1.30319,1.30521,1.30501,1.30338,1.30546,1.30457,1.30338,1.30356,1.30456,1.30461,1.30357,1.30536,1.28449,1.31645,1.31805,1.36901,1.30405,1.3147,1.36203,1.28449,1.30194,1.31547,1.31402,1.28994,1.30381,1.2805,1.32181,1.31112,1.3145,1.27977,1.29607,1.30233,1.288,1.31094,1.28671,1.31122,1.28489,1.31076,1.31082,1.30538,1.30409,1.30047,1.29695,1.29732,1.31376,1.29735,1.31581,1.29791,1.30428,1.3213,1.31177,1.27612,1.38737,1.29719,1.35535,1.30398,1.35629,1.29447,1.37432,1.31549,1.25141,1.25144,1.25088,1.25253,1.31679,1.31679,1.29884,1.28165,1.30502,1.2927,1.31745,1.30532,1.30658,1.2752,1.2936,1.31408,1.30544,1.29904,1.31294,1.27771,1.3083,1.30814,1.3092,1.30862,1.30795,1.30917,1.30994,1.30993,1.30983,1.30981,1.30776,1.40683,1.28706,1.28145,1.31167,1.31835,1.30862,1.30792,1.30811,1.30976,1.30979,1.30835,1.30962,1.30824,1.30793,1.30778,1.30994,1.31002,1.30819,1.30929,1.30941,1.30795,1.33878,1.28105,1.26625,1.27121,1.3139,1.31611,1.28457,1.31625,1.28018,1.30621,1.30569,1.30309,1.3318,1.30008,1.3147,1.30954,1.31854,1.31664,1.30921,1.2849,1.29133,1.33622,1.33446,1.31679,1.28037,1.28007,1.29455,1.2842,1.34732,1.44087,1.3268,1.31201,1.30573,1.37691,1.33103,1.31545,1.31675,1.31617,1.31544,1.31529,1.28498,1.28293,1.31567,1.31533,1.31558,1.31637,1.3147,1.31534,1.32561,1.30052,1.30526,1.28366,1.30977,1.28529,1.284,1.28314,1.27703,1.2831,1.2973,1.28304,1.29728,1.28306,1.28339,1.28191,1.29876,1.28447,1.31129,1.35173,1.30522,1.29795,1.29672,1.29802,1.29762,1.298,1.29686,1.29746,1.29611,1.2983,1.29657,1.29624,1.28709,1.2805,1.29469,1.31091,1.3106,1.28852,1.28802,1.3739,1.35362,1.3707,1.37003,1.2816,1.31357,1.29733,1.28169,1.2842,1.31009,1.31076,1.31043,1.29192,1.27601,1.2842,1.31147,1.30143,1.28311,1.2835,1.28342,1.27988,1.28355,1.31066,1.28198,1.31324,1.3171,1.3182,1.3169,1.31845,1.30967,1.31031,1.28367,1.30386,1.35256,1.2807,1.3117,1.34896,1.28417,1.28143,1.32165,1.37984,1.30271,1.27967,1.31202,1.35331,1.44458,1.40517,1.32552,1.32698,1.28217,1.2794,1.4471,1.31697,1.28238,1.28043,1.35699,1.31142,1.28315,1.29518,1.28325,1.42967,1.2842,1.30949,1.31219,1.28002,1.3539,1.3147,1.30919,1.30949,1.30915,1.30825,1.30784,1.31663,1.30242,1.30264,1.28399,1.34937,1.28362,1.28207,1.28654,1.28607,1.28618,1.33803,1.28638,1.28487,1.28622,1.34593,1.32429,1.28202,1.28197,1.30302,1.28113,1.28028,1.29081,1.28171,1.30026,1.31489,1.3149,1.31057,1.3099,1.28334,1.32607,1.27786,1.28334,1.31088,1.31654,1.28068,1.31644,1.2933,1.31103,1.32368,1.31149,1.29391,1.30919,1.31033,1.28912,1.3147,1.31272,1.30962,1.30962,1.31011,1.37572,1.35921,1.27476,1.31145,1.31296,1.31588,1.28011,1.2959,1.34994,1.28223,1.28205,1.30384,1.28177,1.28223,1.3318,1.28129,1.28758,1.28285,1.31222,1.28828,1.28718,1.28675,1.31025,1.31084,1.28963,1.31542,1.31688,1.31688,1.28515,1.28359,1.31213,1.2932,1.32401,1.30994,1.31036,1.34252,1.30075,1.31654,1.34831,1.31292,1.28243,1.31336,1.32998,1.31535,1.32436,1.28948,1.30303,1.31743,1.41547,1.31867,1.31855,1.34938,1.44284,1.30228,1.33755,1.27815,1.3103,1.30786,1.32161,1.31134,1.30969,1.31009,1.30998,1.31008,1.31182,1.31117,1.31055,1.35028,1.31068,1.31083,1.28213,1.32832,1.31394,1.33665,1.31735,1.32807,1.31511,1.31402,1.31243,1.3233,1.31277,1.31057,1.30981,1.35348,1.35348,1.35348,1.35348,1.40171,1.28323,1.28409,1.30067,1.35091,1.28138,1.30416,1.30874,1.3419,1.27979,1.27973,1.36842,1.31601,1.34743,1.30295,1.30265,1.30307,1.34593,1.36242,1.29611,1.2979,1.31122,1.28675,1.2984,1.36378,1.3022,1.31023,1.44115,1.31656,1.2842,1.30578,1.37131,1.27641,1.27567,1.2856,1.28475,1.31123,1.28482,1.28679,1.30968,1.34223,1.32935,1.374,1.31174,1.32159,1.31076,1.2948,1.36288,1.31636,1.31195,1.29679,1.32159,1.38766,1.35294,1.31437,1.31445,1.30169,1.30204,1.30017,1.30001,1.30198,1.30166,1.31534,1.27526,1.30211,1.28161,1.27526,1.28259,1.28347,1.28488,1.3117,1.32161,1.33681,1.3115,1.35127,1.44774,1.31211,1.31275,1.32891,1.31546,1.32236,1.34723,1.33797,1.3099,1.31102,1.31036,1.30998,1.31034,1.43956,1.31473,1.28275,1.3113,1.3147,1.32587,1.32636,1.32737,1.30739,1.28335,1.28191,1.32864,1.28267,1.28309,1.28245,1.31253,1.28158,1.28375,1.30044,1.3151,1.28192,1.28297,1.2835,1.41474,1.28206,1.28388,1.31622,1.31628,1.31535,1.33507,1.28145,1.27437,1.27485,1.30091,1.30012,1.40417,1.30844,1.28031,1.35505,1.28333,1.27391,1.27951,1.43552,1.31168,1.31235,1.3096,1.28448,1.27528,1.2736,1.28026,1.2842,1.31051,1.27544,1.31473,1.30315,1.27958,1.2833,1.28175,1.31689,1.2831,1.31097,1.27619,1.27456,1.28177,1.28083,1.29872,1.32865,1.31058,1.31129,1.31162,1.31141,1.31025,1.31129,1.31437,1.31473,1.32278,1.31794,1.40108,1.29613,1.31105,1.31174,1.31021,1.31155,1.3116,1.3103,1.35507,1.30204,1.28141,1.27407,1.28013,1.3362,1.31027,1.33709,1.28299,1.28299,1.28336,1.28246,1.28299,1.27774,1.27633,1.2842,1.32945,1.31181,1.30953,1.2842,1.3147,1.27506,1.31004,1.28341,1.31032,1.2842,1.28399,1.30888,1.31001,1.32114,1.2775,1.2842,1.2935,1.31239,1.30659,1.36385,1.32311,1.31112,1.31473,1.30966,1.28006,1.29442,1.30026,1.3474,1.3147,1.31552,1.30978,1.32161,1.31048,1.30991,1.30959,1.30997,1.31932,1.2994,1.30056,1.29966,1.31063,1.31054,1.2842,1.31156,1.31121,1.28384,1.29622,1.2851,1.31263,1.30992,1.32074,1.33733,1.33769,1.3028,1.28473,1.29994,1.31248,1.31217,1.30183,1.30358,1.30325,1.29412,1.30323,1.31892,1.32974,1.33469,1.32064,1.29676,1.42882,1.33592,1.29039,1.2832,1.28166,1.30009,1.30312,1.29367,1.31316,1.2453,1.31473,1.28474,1.29231,1.30041,1.28768,1.31318,1.31762,1.29361,1.31626,1.32176,1.32998,1.34459,1.33225,1.2989,1.32156,1.31106,1.31034,1.31512,1.29477,1.30458,1.38074,1.30139,1.3745,1.40253,1.32034,1.28358,1.28146,1.28522,1.29966,1.29966,1.30322,1.29966,1.32258,1.28487,1.30303,1.27609,1.34703,1.36886,1.31176,1.27609,1.3477,1.33459,1.31273,1.31543,1.30651,1.29299,1.31093,1.28083,1.29966,1.27456,1.30146,1.3762,1.29417,1.27964,1.31213,1.27406,1.2805,1.30348,1.30301,1.27425,1.28443,1.27481,1.29774,1.33537,1.33438,1.32632,1.32963,1.28174,1.43005,1.37251,1.31301,1.297,1.28723,1.30294,1.30299,1.30309,1.3034,1.30129,1.30136,1.30255,1.30178,1.30311,1.30111,1.28443,1.28446,1.2842,1.31714,1.28083,1.28443,1.28443,1.34501,1.31181,1.31016,1.29787,1.33146,1.28671,1.28426,1.28461,1.2846,1.28443,1.32731,1.28429,1.28197,1.2957,1.28443,1.28205,1.28755,1.2724,1.28414,1.28434,1.2817,1.30434,1.2842,1.28438,1.28412,1.31147,1.28699,1.29172,1.29885,1.32601,1.31039,1.28226,1.31545,1.31485,1.31549,1.28404,1.28451,1.28378,1.29849,1.3104,1.312,1.27983,1.28577,1.28405,1.31454,1.32397,1.32214,1.32238,1.32258,1.32255,1.32341,1.32232,1.32412,1.32347,1.32397,1.32207,1.32224,1.3226,1.32245,1.28428,1.31023,1.27984,1.29229,1.31429,1.29316,1.29193,1.28436,1.28241,1.2969,1.37847,1.36342,1.28331,1.31072,1.31439,1.32456,1.29483,1.3366,1.28491,1.35385,1.27685,1.31401,1.29461,1.38289,1.28181,1.39224,1.28301,1.28244,1.30311,1.30074,1.302,1.30125,1.30938,1.30211,1.30089,1.30105,1.30259,1.29129,1.31081,1.30975,1.32861,1.30777,1.28088,1.38894,1.2841,1.32571,1.41698,1.31675,1.28475,1.2841,1.31649,1.31505,1.31496,1.31656,1.31657,1.3151,1.2841,1.29518,1.32017,1.30197,1.27566,1.28179,1.32617,1.28544,1.30455,1.33546,1.29692,1.29215,1.27873,1.28328,1.28388,1.28366,1.28194,1.28154,1.31068,1.3147,1.3739,1.27495,1.29205,1.30782,1.32806,1.28312,1.35251,1.30575,1.30617,1.30575,1.30663,1.30711,1.3056,1.29638,1.28485,1.30672,1.31095,1.30736,1.31688,1.31688,1.28283,1.3147,1.34796,1.33549,1.29985,1.30997,1.37603,1.28359,1.31266,1.30292,1.29406,1.38315,1.30997,1.3017,1.30974,1.29326,1.30951,1.32155,1.27747,1.2832,1.30695,1.30755,1.29842,1.32475,1.30963,1.28433,1.32221,1.31206,1.31175,1.2849,1.34879,1.30664,1.28454,1.31572,1.31366,1.31181,1.32802,1.31747,1.35686,1.3159,1.3147,1.3147,1.28503,1.31,1.31178,1.275,1.34042,1.3147,1.3151,1.35584,1.288,1.28851,1.28656,1.28716,1.2841,1.30679,1.28413,1.28362,1.28448,1.28226,1.33513,1.30119,1.30185,1.29682,1.28713,1.28744,1.28729,1.31049,1.29756,1.30086,1.29891,1.31017,1.28369,1.30352,1.2958,1.29691,1.2818,1.2841,1.38088,1.29851,1.4049,1.29027,1.29808,1.30638,1.28403,1.28481,1.28623,1.28436,1.31067,1.28576,1.28478,1.31028,1.2856,1.28393,1.31285,1.28693,1.2849,1.27769,1.29872,1.2893,1.28936,1.31927,1.34143,1.34166,1.31193,1.29474,1.2968,1.37028,1.29156,1.31866,1.31176,1.31259,1.29834,1.30165,1.29856,1.30754,1.31859,1.35671,1.31178,1.31254,1.29425,1.29628,1.31055,1.31244,1.31255,1.31042,1.31261,1.31048,1.31088,1.31187,1.31231,1.31038,1.3124,1.28448,1.31057,1.28437,1.2847,1.2841,1.30283,1.30156,1.30146,1.31111,1.28722,1.28839,1.28809,1.2841,1.32043,1.35145,1.28638,1.31571,1.31497,1.31853,1.31473,1.35132,1.30349,1.30222,1.32578,1.43325,1.30812,1.31645,1.29063,1.30072,1.29854,1.31137,1.37019,1.37204,1.3014,1.42959,1.31585,1.34546,1.37227,1.31231,1.31331,1.30186,1.30472,1.29199,1.31223,1.27978,1.27456,1.43204,1.43358,1.37137,1.30883,1.29527,1.31117,1.38996,1.27473,1.28521,1.28746,1.32751,1.3082,1.30327,1.31591,1.32881,1.43365,1.33678,1.3741,1.31705,1.28179,1.28076,1.28213,1.28179,1.28179,1.28179,1.28179,1.28179,1.28179,1.28061,1.28179,1.29484,1.31507,1.30272,1.30287,1.30151,1.30271,1.30166,1.30187,1.33078,1.31138,1.31121,1.31164,1.2963,1.3942,1.31637,1.30411,1.36663,1.32488,1.40277,1.2841,1.28172,1.28143,1.2815,1.2822,1.31441,1.28187,1.34012,1.28456,1.28456,1.28555,1.28456,1.31705,1.31258,1.30965,1.29213,1.29194,1.29229,1.43162,1.31402,1.27979,1.3557,1.31129,1.2732,1.2993,1.31115,1.2841,1.29681,1.32655,1.31397,1.31288,1.30013,1.31255,1.31296,1.2944,1.29684,1.34413,1.31397,1.34232,1.3161,1.2948,1.31613,1.28311,1.28186,1.31515,1.31167,1.31444,1.28828,1.31117,1.31594,1.31613,1.29117,1.29322,1.28313,1.35416,1.28203,1.31433,1.3269,1.31114,1.27396,1.31282,1.31191,1.30291,1.28163,1.28488,1.28192,1.30124,1.36871,1.28599,1.30234,1.35326,1.31101,1.27427,1.32429,1.31266,1.30655,1.31461,1.32343,1.2842,1.30306,1.36235,1.32447,1.28576,1.2755,1.32357,1.30629,1.30439,1.30418,1.30494,1.30418,1.30421,1.32456,1.32436,1.32424,1.32429,1.32437,1.32471,1.27427,1.31072,1.3147,1.28131,1.29815,1.29083,1.31068,1.31083,1.35533,1.37439,1.37477,1.3023,1.30103,1.28026,1.28134,1.29399,1.31435,1.27427,1.29879,1.30044,1.32592,1.27589,1.31848,1.27486,1.27516,1.27471,1.28897,1.28186,1.35362,1.35643,1.32709,1.35148,1.31314,1.32411,1.32384,1.31922,1.3497,1.29169,1.34737,1.34563,1.30212,1.37311,1.29333,1.32554,1.27594,1.43647,1.30147,1.41203,1.28283,1.2976,1.30471,1.29854,1.32763,1.44427,1.29535,1.29739,1.29739,1.31444,1.29639,1.31058,1.31551,1.31392,1.30319,1.3036,1.31665,1.28473,1.29535,1.29671,1.33629,1.32055,1.31419,1.2838,1.43662,1.31546,1.34286,1.34437,1.33044,1.31447,1.31669,1.31401,1.3115,1.31316,1.29658,1.31498,1.30626,1.3252,1.32675,1.32664,1.2817,1.28168,1.32252,1.32233,1.32085,1.31926,1.31313,1.404,1.31904,1.32218,1.32256,1.3038,1.3192,1.30493,1.31138,1.31068,1.31311,1.31492,1.30422,1.31264,1.30298,1.31002,1.3116,1.30461,1.28999,1.30427,1.31056,1.30367,1.30965,1.30481,1.29728,1.30289,1.30368,1.29507,1.29542,1.44456,1.31675,1.27551,1.3046,1.28179,1.31531,1.30481,1.28912,1.2841,1.31114,1.29918,1.29866,1.28222,1.28313,1.43015,1.28948,1.33346,1.35481,1.32218,1.27428,1.31112,1.3856,1.31497,1.44353,1.35892,1.35928,1.44555,1.31523,1.29847,1.31688,1.2953,1.29464,1.27379,1.31039,1.34039,1.31548,1.31161,1.31162,1.31205,1.31133,1.31255,1.31294,1.30958,1.29227,1.31005,1.30677,1.30658,1.28802,1.32539,1.32671,1.32199,1.32036,1.33223,1.32193,1.32372,1.32525,1.3243,1.32549,1.3241,1.3241,1.29394,1.31661,1.31035,1.31167,1.30986,1.31578,1.31435,1.31192,1.31065,1.416,1.31054,1.31243,1.35382,1.35402,1.3047,1.37357,1.31855,1.28294,1.3147,1.31293,1.31424,1.27947,1.27824,1.27921,1.2779,1.27823,1.27901,1.27968,1.27891,1.27817,1.27962,1.27951,1.27963,1.31114,1.31779,1.31762,1.31778,1.31756,1.31917,1.30958,1.30767,1.31448,1.2731,1.43987,1.4157,1.27401,1.30981,1.31197,1.28235,1.28148,1.34041,1.34881,1.32772,1.3295,1.33212,1.33029,1.35181,1.34852,1.29321,1.31184,1.31097,1.29296,1.38393,1.29309,1.29394,1.32075,1.3133,1.30413,1.30728,1.30723,1.30767,1.34325,1.36404,1.30796,1.28793,1.3821,1.25583,1.30996,1.31033,1.31516,1.31126,1.31044,1.25846,1.32528,1.27988,1.27548,1.29483,1.39479,1.3249,1.43192,1.2579,1.37644,1.3223,1.32559,1.30984,1.2754,1.29486,1.31382,1.31205,1.31347,1.31158,1.31365,1.31383,1.29726,1.29742,1.2737,1.27466,1.32991,1.33207,1.30043,1.27306,1.30993,1.39915,1.324,1.274,1.25421,1.31202,1.30076,1.31429,1.31449,1.3156,1.28061,1.27665,1.30082,1.3276,1.31134,1.31153,1.29893,1.25459,1.31369,1.32355,1.324,1.31587,1.31638,1.32298,1.32094,1.32774,1.30168,1.30083,1.28397,1.2963,1.32705,1.3203,1.39563,1.38445,1.36933,1.32023,1.32589,1.44592,1.31251,1.31331,1.30994,1.31141,1.32238,1.31022,1.32557,1.32734,1.31517,1.28342,1.32722,1.31642,1.32087,1.27283,1.27424,1.28542,1.32924,1.28461,1.31013,1.33225,1.29724,1.28063,1.3227,1.28163,1.27295,1.27975,1.28391,1.27382,1.27466,1.29306,1.32968,1.38892,1.41463,1.29256,1.27453,1.27255,1.28327,1.27555,1.27349,1.2961,1.27267,1.27359,1.31149,1.28034,1.27283,1.34464,1.2744,1.27365,1.35272,1.2984,1.2919,1.29741,1.29759,1.27248,1.32736,1.27406,1.27466,1.2751,1.30263,1.31773,1.27367,1.2725,1.27309,1.28534,1.314,1.31498,1.27363,1.27312,1.27422,1.27444,1.27464,1.37306,1.32287,1.31319,1.2552,1.31781,1.35162,1.30188,1.28823,1.3152,1.30775,1.27427,1.31369,1.30766,1.31386,1.29052,1.30123,1.41594,1.27423,1.29031,1.27482,1.27338,1.29995,1.28161,1.28189,1.28314,1.32081,1.30775,1.28342,1.30398,1.30465,1.30547,1.31159,1.28106,1.30637,1.30494,1.27429,1.29691,1.2947,1.27999,1.28022,1.27967,1.30672,1.30195,1.27372,1.35284,1.27986,1.28003,1.28002,1.32738,1.31707,1.28009,1.27354,1.27455,1.27467,1.27454,1.31094,1.28038,1.29894,1.28038,1.31553,1.29689,1.31667,1.32168,1.29162,1.29778,1.31108,1.31285,1.31342,1.31671,1.32794,1.3282,1.2741,1.2744,1.35988,1.30424,1.31151,1.31628,1.31616,1.31671,1.31606,1.30585,1.30608,1.30584,1.30453,1.37339,1.31341,1.31326,1.32233,1.32874,1.32816,1.32627,1.30565,1.29732,1.31575,1.30582,1.32888,1.30674,1.32774,1.28305,1.31169,1.31109,1.31047,1.3111,1.31185,1.3115,1.30314,1.31003,1.28676,1.274,1.32429,1.27441,1.32328,1.35318,1.31256,1.28219,1.31093,1.31078,1.30431,1.31135,1.31094,1.31636,1.31222,1.31154,1.31003,1.31027,1.29502,1.31239,1.31099,1.27558,1.29666,1.29479,1.28625,1.31106,1.30492,1.30544,1.30997,1.31194,1.31065,1.31167,1.32846,1.43078,1.32228,1.29637,1.32322,1.31142,1.32803,1.32467,1.32423,1.31023,1.28393,1.29848,1.30252,1.29197,1.30449,1.29838,1.3349,1.29345,1.31123,1.3111,1.29317,1.29844,1.29908,1.32955,1.3279,1.42857,1.30448,1.30933,1.30257,1.31154,1.31254,1.30391,1.38738,1.32768,1.32719,1.30259,1.27407,1.30659,1.27453,1.30475,1.30626,1.30636,1.30574,1.30469,1.30598,1.30574,1.44531,1.2981,1.31724,1.44255,1.30266,1.3114,1.29546,1.37461,1.30485,1.28395,1.2966,1.34299,1.2941,1.32626,1.30524,1.27982,1.32728,1.32812,1.30599,1.3024,1.29892,1.3226,1.32035,1.32717,1.32567,1.32634,1.2959,1.30038,1.32323,1.3269,1.32055,1.30567,1.31444,1.297,1.27989,1.3263,1.31143,1.29743,1.32013,1.32437,1.32408,1.35227,1.27662,1.32629,1.31178,1.27661,1.27363,1.32384,1.32241,1.32794,1.32782,1.31435,1.32485,1.32444,1.29491,1.31292,1.32571,1.25604,1.3216,1.25584,1.2566,1.31369,1.27553,1.3122,1.2975,1.29836,1.2962,1.29823,1.34518,1.34533,1.29733,1.27983,1.2793,1.35881,1.32665,1.29863,1.29921,1.31453,1.30061,1.31601,1.31938,1.295,1.27259,1.32795,1.32489,1.3116,1.43566,1.31037,1.29185,1.25792,1.25654,1.31473,1.29301,1.30989,1.3146,1.27967,1.30441,1.31251,1.30599,1.30337,1.33597,1.31303,1.29291,1.27992,1.37708,1.30037,1.30188,1.30206,1.42498,1.30156,1.42875,1.33995,1.31256,1.32752,1.32902,1.32209,1.29631,1.27742,1.27467,1.31106,1.27352,1.32712,1.28461,1.27455,1.29727,1.27426,1.307,1.41843,1.32213,1.42027,1.32458,1.31392,1.30301,1.30337,1.30261,1.30109,1.30178,1.34862,1.35952,1.32349,1.3234,1.32225,1.29326,1.27488,1.41954,1.27547,1.28848,1.29524,1.34745,1.2805,1.30954,1.29163,1.34438,1.3457,1.30683,1.29811,1.34461,1.31025,1.31055,1.29524,1.29482,1.34447,1.31963,1.30234,1.30429,1.30401,1.30433,1.28355,1.27509,1.30266,1.27551,1.3209,1.30271,1.36048,1.30307,1.35474,1.34028,1.30951,1.32693,1.31572,1.30424,1.30242,1.30234,1.30442,1.30492,1.30445,1.36843,1.35655,1.31289,1.31398,1.28702,1.28046,1.32574,1.32584,1.28053,1.30125,1.34209,1.35268,1.30128,1.27467,1.28084,1.31576,1.31719,1.31957,1.3187,1.31212,1.32691,1.27528,1.3134,1.33487,1.34817,1.31412,1.31244,1.31204,1.2996,1.3171,1.30871,1.44273,1.3359,1.3301,1.33772,1.31713,1.31711,1.31738,1.31096,1.31995,1.39514,1.36761,1.27829,1.27555,1.27504,1.29998,1.31502,1.29066,1.31116,1.28615,1.33485,1.29726,1.29567,1.30123,1.35246,1.29613,1.29845,1.29693,1.31738,1.31761,1.31692,1.30255,1.29389,1.28319,1.29511,1.31265,1.32215,1.27984,1.29655,1.2987,1.27786,1.27715,1.27629,1.3214,1.31894,1.31334,1.27698,1.30517,1.31316,1.32199,1.32221,1.32188,1.31315,1.35242,1.27924,1.31501,1.33061,1.27584,1.31414,1.28551,1.31493,1.2844,1.28634,1.29785,1.30062,1.29707,1.32272,1.324,1.32894,1.27907,1.29081,1.29067,1.32235,1.32365,1.32372,1.32203,1.32357,1.32395,1.32245,1.32267,1.28032,1.30618,1.30642,1.36243,1.30865,1.29503,1.34206,1.3046,1.30487,1.344,1.31065,1.33854,1.35322,1.30606,1.32225,1.32506,1.3176,1.31832,1.29232,1.31455,1.31606,1.31365,1.2965,1.29729,1.32296,1.32424,1.29094,1.29585,1.3226,1.32345,1.3221,1.32216,1.30143,1.30091,1.32534,1.30647,1.30998,1.30542,1.31173,1.31061,1.31457,1.34372,1.31011,1.31314,1.27966,1.28408,1.29282,1.31055,1.35485,1.28148,1.313,1.31317,1.31481,1.27763,1.27887,1.3142,1.28338,1.27216,1.28162,1.2916,1.31122,1.2829,1.2812,1.29706,1.29979,1.27918,1.28103,1.28074,1.28244,1.2818,1.30331,1.31701,1.31595,1.31735,1.31763,1.40585,1.32181,1.2819,1.30613,1.30513,1.27955,1.3126,1.31113,1.31124,1.27487,1.28073,1.33876,1.32488,1.32461,1.3124,1.3254,1.32547,1.3242,1.31268,1.3249,1.32398,1.32168,1.32175,1.36866,1.2883,1.32484,1.32437,1.31605,1.31045,1.2964,1.29623,1.32994,1.29106,1.32507,1.32231,1.29458,1.29637,1.32214,1.32255,1.31994,1.32317,1.29786,1.31618,1.31438,1.2834,1.32302,1.31095,1.3115,1.31518,1.32089,1.32254,1.32271,1.32949,1.33265,1.30975,1.31365,1.29825,1.31272,1.31446,1.27594,1.27632,1.32347,1.32342,1.31319,1.2991,1.29877,1.31175,1.32164,1.3175,1.32874,1.32038,1.32183,1.3013,1.35865,1.30995,1.29953,1.29287,1.33043,1.29855,1.3289,1.32224,1.322,1.32045,1.32175,1.32268,1.32101,1.32511,1.29966,1.28203,1.32396,1.32434,1.32514,1.32403,1.32404,1.32527,1.31579,1.27717,1.31281,1.3128,1.29646,1.32703,1.32479,1.32441,1.32071,1.32218,1.3216,1.32527,1.31764,1.29861,1.30246,1.30702,1.31243,1.31208,1.30671,1.32569,1.27335,1.3372,1.3079,1.28366,1.29963,1.32644,1.29824,1.34764,1.2741,1.31459,1.31098,1.29546,1.30051,1.33027,1.3098,1.31458,1.32137,1.32524,1.32568,1.32436,1.32516,1.28017,1.32397,1.32397,1.32366,1.32508,1.32461,1.32475,1.32266,1.32281,1.32447,1.32299,1.32548,1.28297,1.31109,1.32376,1.31607,1.32304,1.32099,1.32328,1.32076,1.32205,1.32194,1.31202,1.33636,1.34701,1.31338,1.31332,1.33073,1.32953,1.33075,1.30808,1.3411,1.28341,1.32833,1.35195,1.31677,1.2741,1.27427,1.32389,1.32432,1.31063,1.31143,1.31174,1.32552,1.31196,1.31365,1.32358,1.32561,1.3236,1.27506,1.30582,1.30696,1.30604,1.30698,1.30639,1.30778,1.30709,1.31232,1.31079,1.31174,1.32954,1.33158,1.35351,1.3313,1.32365,1.325,1.32398,1.32531,1.32429,1.32509,1.30577,1.32556,1.32559,1.32135,1.32387,1.32521,1.31609,1.31201,1.27675,1.31293,1.27508,1.28967,1.28357,1.30728,1.32552,1.31615,1.28274,1.28479,1.31245,1.31996,1.31191,1.28485,1.31877,1.27412,1.3298,1.32985,1.33013,1.29548,1.32791,1.32183,1.31352,1.30602,1.30398,1.30406,1.30409,1.30569,1.28348,1.306,1.29449,1.2951,1.25143,1.29651,1.30934,1.32705,1.28374,1.28535,1.28485,1.28467,1.29512,1.2728,1.31275,1.32731,1.30826,1.3259,1.32746,1.29487,1.31256,1.32729,1.32711,1.31473,1.32146,1.30231,1.29043,1.31456,1.31446,1.2829,1.30064,1.31142,1.31474,1.28415,1.30703,1.27426,1.30033,1.29983,1.29875,1.29921,1.29906,1.29877,1.30043,1.30001,1.31035,1.27483,1.32972,1.31602,1.31525,1.27322,1.28871,1.2851,1.28798,1.28722,1.28985,1.37481,1.37685,1.37535,1.3358,1.33554,1.31605,1.30527,1.31605,1.31532,1.33156,1.33204,1.3469,1.37485,1.37497,1.28048,1.28455,1.33253,1.3769,1.34819,1.34866,1.31088,1.29644,1.29811,1.29815,1.327,1.31417,1.32718,1.32699,1.32784,1.3279,1.3139,1.32627,1.32517,1.32564,1.32656,1.31598,1.36308,1.31527,1.36277,1.31633,1.32183,1.32063,1.30044,1.32639,1.32557,1.32564,1.32418,1.30409,1.30575,1.29749,1.29749,1.29749,1.29749,1.29749,1.29749,1.32504,1.32535,1.29749,1.32381,1.29749,1.29749,1.29749,1.29749,1.29749,1.29749,1.29749,1.29749,1.40454,1.29043,1.28433,1.32755,1.32627,1.32656,1.31187,1.31117,1.30552,1.31443,1.31388,1.29518,1.28529,1.37698,1.3115,1.29089,1.29158,1.29092,1.29194,1.29229,1.29243,1.29168,1.29053,1.29182,1.31661,1.2957,1.3313,1.29544,1.315,1.29379,1.3047,1.4,1.32216,1.30094,1.28492,1.30383,1.27341,1.27357,1.27322,1.29143,1.29179,1.2997,1.30183,1.32684,1.33627,1.28613,1.30289,1.29838,1.29818,1.30029,1.32149,1.27435,1.30009,1.29888,1.29876,1.30297,1.28023,1.28492,1.34097,1.32796,1.32837,1.35166,1.30387,1.3154,1.315,1.30896,1.32529,1.32477,1.30915,1.33619,1.32085,1.30157,1.28811,1.28517,1.28809,1.28865,1.28849,1.28728,1.28822,1.30776,1.30792,1.31213,1.31728,1.28096,1.28166,1.31556,1.2747,1.28824,1.29053,1.29525,1.28152,1.28335,1.28398,1.29774,1.34606,1.29616,1.2828,1.30991,1.36005,1.29395,1.28449,1.28005,1.28174,1.27601,1.30503,1.28428,1.31238,1.29935,1.28507,1.28408,1.27461,1.27975,1.30363,1.31899,1.29246,1.29949,1.30227,1.30207,1.29991,1.27484,1.30873,1.31244,1.30722,1.30891,1.31037,1.30859,1.31156,1.37777,1.31051,1.31091,1.3091,1.31935,1.31513,1.31951,1.31857,1.31719,1.28493,1.31749,1.30485,1.29626,1.29572,1.28321,1.32414,1.30862,1.31081,1.32359,1.32364,1.29085,1.29073,1.29483,1.31284,1.30749,1.29516,1.29658,1.29471,1.29607,1.29494,1.29457,1.29605,1.29646,1.29634,1.28231,1.295,1.36567,1.31016,1.29509,1.28485,1.27901,1.29646,1.31657,1.2822,1.30961,1.37606,1.26741,1.31349,1.31103,1.28536,1.28919,1.3169,1.31087,1.3112,1.327,1.31099,1.31181,1.3113,1.36401,1.27298,1.33516,1.33434,1.33604,1.36385,1.29447,1.2955,1.27332,1.31914,1.3297,1.27444,1.34311,1.32888,1.28074,1.30665,1.27922,1.3233,1.29857],[103.7958,103.78521,103.79667,103.95712,103.95963,103.96103,103.96337,103.83816,103.89,103.95951,103.90232,103.83759,103.8398,103.83562,103.9592,103.86446,103.95684,103.93238,103.71139,103.79383,103.95775,103.85234,103.79811,103.87288,103.84521,103.84597,103.90076,103.84253,103.9064,103.78585,103.90315,103.90097,103.91479,103.82381,103.84284,103.8568,103.8731,103.84297,103.8327,103.83742,103.9298,103.85901,103.84444,103.82694,103.82614,103.82704,103.84265,103.8561,103.84311,103.7685,103.7685,103.88947,103.84238,103.908,103.94406,103.86332,103.8498,103.87367,103.82765,103.84253,103.8966,103.85303,103.75992,103.82306,103.858,103.84424,103.84424,103.84424,103.84255,103.84661,103.84253,103.85684,103.83994,103.95994,103.82572,103.92342,103.95945,103.88257,103.91529,103.92316,103.84491,103.80827,103.92206,103.924,103.85063,103.74476,103.85213,103.74468,103.91492,103.85293,103.89905,103.88065,103.77626,103.83482,103.77867,103.84283,103.85799,103.86214,103.80159,103.8859,103.80686,103.84176,103.86096,103.88356,103.84659,103.86901,103.85883,103.86052,103.8431,103.84355,103.96321,103.95931,103.84335,103.84298,103.84318,103.84308,103.84275,103.84487,103.84331,103.83797,103.88577,103.85923,103.85959,103.88559,103.88576,103.77532,103.85813,103.90582,103.85969,103.84109,103.83867,103.79426,103.8269,103.8445,103.8433,103.84287,103.82666,103.85343,103.88605,103.86468,103.88326,103.88114,103.84032,103.85116,103.93974,103.88341,103.82694,103.85022,103.8694,103.8543,103.81644,103.86326,103.84703,103.84163,103.85033,103.85591,103.8319,103.88143,103.88285,103.83603,103.88139,103.88148,103.84433,103.82714,103.83874,103.82199,103.84774,103.90775,103.89107,103.84195,103.8421,103.87235,103.83274,103.86134,103.88278,103.84894,103.82831,103.79537,103.88131,103.79822,103.94126,103.88662,103.83038,103.84014,103.90558,103.83125,103.88313,103.94814,103.8406,103.8585,103.82758,103.84657,103.84566,103.85619,103.85423,103.85471,103.85647,103.85508,103.85459,103.71259,103.93814,103.89935,103.83226,103.84203,103.85169,103.8417,103.88257,103.75949,103.84791,103.84633,103.85958,103.8373,103.79555,103.82403,103.79424,103.7939,103.83391,103.86592,103.84039,103.86225,103.96046,103.89649,103.96043,103.96107,103.85614,103.91483,103.85344,103.85776,103.96249,103.84424,103.83649,103.79544,103.85822,103.91476,103.91574,103.83839,103.96605,103.8866,103.90555,103.91641,103.84417,103.88728,103.7685,103.84983,103.79542,103.78584,103.88464,103.85296,103.84253,103.9086,103.84718,103.87976,103.88702,103.8289,103.84108,103.83406,103.81955,103.76746,103.76804,103.91503,103.8226,103.88589,103.85967,103.853,103.89152,103.86898,103.85922,103.85002,103.78374,103.91109,103.82393,103.85804,103.87076,103.87111,103.8909,103.82377,103.76103,103.76566,103.83965,103.86265,103.86291,103.94037,103.82342,103.82612,103.88671,103.93291,103.84786,103.88133,103.86453,103.78258,103.83774,103.8284,103.9127,103.80256,103.72422,103.91158,103.91101,103.84138,103.79117,103.8465,103.85133,103.71501,103.91265,103.88701,103.88721,103.84296,103.69789,103.89558,103.82167,103.92311,103.84064,103.88803,103.85774,103.86212,103.84466,103.86185,103.82334,103.77955,103.85757,103.90401,103.84083,103.82477,103.88136,103.88157,103.88267,103.91297,103.88591,103.87216,103.86142,103.83967,103.88794,103.90351,103.72676,103.86305,103.8704,103.86173,103.73584,103.86268,103.86331,103.73709,103.91476,103.78891,103.85365,103.83026,103.9143,103.91395,103.91433,103.9139,103.9145,103.9128,103.91281,103.91382,103.83975,103.82685,103.88243,103.85144,103.85198,103.96211,103.84969,103.84968,103.85091,103.84962,103.84896,103.8536,103.84885,103.85291,103.82377,103.83901,103.94188,103.84097,103.88129,103.88151,103.8833,103.84755,103.85095,103.85056,103.8495,103.85066,103.84928,103.70083,103.8622,103.75727,103.82694,103.8627,103.9603,103.83582,103.8474,103.85327,103.84775,103.93195,103.84192,103.96301,103.84589,103.84637,103.88686,103.8445,103.84472,103.96262,103.85072,103.85159,103.85452,103.90107,103.87271,103.86072,103.84395,103.74904,103.76907,103.85241,103.84106,103.84369,103.85567,103.84249,103.84982,103.84912,103.8505,103.8495,103.85274,103.85076,103.81064,103.85691,103.87767,103.74683,103.87361,103.87215,103.87275,103.8723,103.87394,103.87346,103.8741,103.72199,103.82242,103.82415,103.93683,103.75388,103.91466,103.84335,103.83312,103.95919,103.85313,103.78725,103.85444,103.90349,103.88591,103.86103,103.84251,103.9675,103.82591,103.78136,103.84274,103.90132,103.8436,103.85047,103.85097,103.85984,103.86033,103.86046,103.86388,103.84387,103.84131,103.88488,103.86146,103.86153,103.86089,103.86178,103.84653,103.85983,103.82372,103.88019,103.88215,103.85051,103.90878,103.82559,103.80309,103.84462,103.84528,103.88114,103.89037,103.84831,103.86077,103.86054,103.86066,103.86083,103.86073,103.8607,103.86054,103.84986,103.86064,103.86054,103.84073,103.86054,103.86054,103.86054,103.85257,103.86679,103.82224,103.93345,103.88711,103.88754,103.88458,103.8355,103.8522,103.89587,103.84346,103.88378,103.85284,103.86081,103.94068,103.85274,103.85204,103.86317,103.86226,103.89763,103.85063,103.79507,103.93287,103.85331,103.84197,103.8523,103.77921,103.85127,103.87622,103.82572,103.80081,103.85573,103.91392,103.88209,103.82279,103.82343,103.82299,103.82355,103.82907,103.74221,103.83364,103.87546,103.78663,103.84881,103.88744,103.85209,103.75154,103.75859,103.85202,103.86437,103.95915,103.8359,103.85169,103.91325,103.91139,103.84111,103.90294,103.85109,103.9153,103.91463,103.91632,103.80503,103.83825,103.83735,103.9049,103.84271,103.80346,103.84399,103.8467,103.84572,103.84483,103.85205,103.78765,103.88487,103.88487,103.90988,103.86199,103.84533,103.85203,103.69285,103.86118,103.77035,103.84212,103.85642,103.85366,103.84206,103.90497,103.88416,103.89146,103.90448,103.77384,103.85829,103.85829,103.85829,103.85829,103.85829,103.85829,103.85829,103.85829,103.85829,103.85829,103.85829,103.8531,103.86193,103.84399,103.845,103.83165,103.91365,103.88271,103.82837,103.84699,103.79784,103.85509,103.77954,103.85301,103.88443,103.7598,103.84643,103.86288,103.74626,103.8796,103.84703,103.8501,103.85743,103.81056,103.85954,103.89264,103.86354,103.88014,103.85172,103.88865,103.88805,103.84176,103.96858,103.83176,103.88233,103.91463,103.85951,103.8519,103.82951,103.82903,103.84498,103.84399,103.88817,103.87805,103.71963,103.86046,103.85961,103.8595,103.85932,103.85736,103.86034,103.88751,103.81486,103.84253,103.78525,103.91971,103.70071,103.77343,103.77495,103.8967,103.83415,103.78559,103.89978,103.84786,103.96725,103.94852,103.70107,103.6637,103.86582,103.83079,103.79593,103.95045,103.85993,103.84664,103.84688,103.84615,103.7685,103.76842,103.84736,103.91623,103.87265,103.84138,103.91542,103.76824,103.86329,103.88886,103.82636,103.95402,103.84253,103.86381,103.74017,103.9148,103.82208,103.84655,103.84416,103.84328,103.85237,103.86213,103.91346,103.84528,103.85191,103.89468,103.91143,103.85853,103.88911,103.87452,103.84318,103.79594,103.91622,103.85821,103.92438,103.76111,103.76817,103.87372,103.83905,103.91532,103.84253,103.74756,103.86294,103.8419,103.83946,103.86027,103.85679,103.84357,103.84395,103.84132,103.84425,103.84519,103.76812,103.89425,103.85664,103.85021,103.75667,103.82381,103.86127,103.86295,103.86343,103.86347,103.73346,103.86396,103.8507,103.85115,103.84217,103.88485,103.80047,103.86968,103.84532,103.8833,103.85837,103.85304,103.7685,103.85106,103.88191,103.9007,103.9345,103.90306,103.95374,103.86359,103.83873,103.91429,103.91525,103.88215,103.83261,103.86179,103.78784,103.86158,103.96609,103.89282,103.7956,103.8592,103.86235,103.86062,103.96134,103.7482,103.8821,103.95397,103.85871,103.85981,103.83875,103.80699,103.87229,103.84584,103.76061,103.84835,103.93784,103.84217,103.76119,103.78249,103.86133,103.85965,103.85994,103.84336,103.84218,103.76053,103.76471,103.81598,103.84552,103.84603,103.80763,103.82895,103.84059,103.84888,103.87283,103.8099,103.68707,103.78906,103.7879,103.78939,103.82995,103.8414,103.69902,103.78471,103.93348,103.8389,103.91259,103.83748,103.84346,103.84234,103.84353,103.83998,103.68877,103.78539,103.68822,103.95821,103.85829,103.85829,103.85821,103.85932,103.91682,103.91491,103.9149,103.91386,103.91366,103.86501,103.86088,103.86054,103.84893,103.84291,103.86054,103.84187,103.86663,103.86361,103.84037,103.89275,103.9033,103.91613,103.88774,103.84204,103.78663,103.87348,103.88794,103.88839,103.84957,103.76697,103.85272,103.88638,103.75823,103.83983,103.75719,103.75703,103.83669,103.91242,103.7662,103.85628,103.83898,103.90202,103.8435,103.84367,103.76093,103.86299,103.83797,103.88725,103.90121,103.83738,103.8223,103.85775,103.84573,103.79855,103.82485,103.80467,103.83714,103.83709,103.83836,103.796,103.8224,103.86193,103.86054,103.84767,103.84691,103.84843,103.84686,103.82431,103.84619,103.84775,103.84632,103.84616,103.84794,103.84838,103.84799,103.84639,103.8477,103.84805,103.79724,103.83661,103.92979,103.83648,103.82446,103.85274,103.8468,103.82362,103.86003,103.83587,103.8488,103.85257,103.8435,103.87359,103.85829,103.828,103.8362,103.78381,103.87923,103.84809,103.8007,103.86085,103.8248,103.78316,103.882,103.87916,103.7738,103.84775,103.84242,103.85461,103.84001,103.7213,103.75984,103.86067,103.84332,103.86231,103.84721,103.8615,103.84309,103.86321,103.8615,103.84288,103.82358,103.84417,103.89663,103.86069,103.92162,103.69112,103.72143,103.86235,103.72349,103.85441,103.83707,103.76837,103.83707,103.83707,103.83707,103.84647,103.84921,103.89011,103.85097,103.84974,103.84041,103.847,103.8588,103.90726,103.84935,103.84845,103.84923,103.84129,103.91025,103.72296,103.81946,103.83938,103.83987,103.8687,103.85377,103.91524,103.9152,103.76017,103.74223,103.71469,103.84644,103.91633,103.84801,103.84907,103.84968,103.83999,103.84431,103.93181,103.76758,103.9152,103.84692,103.85105,103.84094,103.86125,103.87366,103.86306,103.79652,103.84119,103.89918,103.81295,103.86462,103.79809,103.85952,103.86309,103.9084,103.90729,103.82818,103.8868,103.69375,103.86117,103.84181,103.83643,103.83698,103.74826,103.96253,103.86146,103.84518,103.85052,103.8218,103.83852,103.76583,103.85407,103.83596,103.83596,103.83596,103.93536,103.82575,103.84245,103.85688,103.91496,103.84749,103.91407,103.85178,103.84245,103.84245,103.90023,103.89955,103.84627,103.84592,103.84474,103.84309,103.84335,103.84655,103.84467,103.84276,103.8432,103.84457,103.84454,103.84262,103.85569,103.7603,103.91452,103.8381,103.84456,103.91381,103.90092,103.84245,103.90232,103.91574,103.84079,103.75697,103.84243,103.84296,103.82623,103.90216,103.85744,103.6947,103.71804,103.85089,103.85238,103.83707,103.83707,103.76051,103.83248,103.83395,103.85396,103.88301,103.84083,103.85509,103.85368,103.85189,103.85381,103.85255,103.85164,103.71891,103.86157,103.90871,103.90521,103.90848,103.86337,103.84938,103.75818,103.86166,103.84563,103.84856,103.7592,103.76066,103.78706,103.84455,103.84389,103.73755,103.85365,103.84655,103.85163,103.90426,103.84278,103.85397,103.85349,103.88261,103.83906,103.83086,103.84264,103.84146,103.85206,103.85401,103.85344,103.85205,103.85261,103.85361,103.85817,103.82334,103.88642,103.74468,103.83241,103.83393,103.80676,103.85259,103.88439,103.8853,103.75546,103.84256,103.84442,103.84307,103.84365,103.84367,103.82832,103.85122,103.84293,103.82319,103.86923,103.9163,103.8535,103.92143,103.92153,103.85702,103.82213,103.77386,103.84875,103.84194,103.83665,103.83919,103.84068,103.83964,103.88163,103.88217,103.88213,103.73419,103.78056,103.7865,103.73427,103.75888,103.75949,103.88131,103.88727,103.76619,103.82261,103.85311,103.82232,103.82378,103.82393,103.8222,103.85819,103.84695,103.84449,103.83881,103.84182,103.83546,103.85163,103.88177,103.84135,103.84655,103.84738,103.84647,103.84606,103.84608,103.84816,103.8461,103.84642,103.8466,103.84645,103.84649,103.84617,103.84606,103.8465,103.84629,103.84758,103.8476,103.84652,103.84752,103.84688,103.84834,103.84768,103.84645,103.84689,103.84762,103.84313,103.86195,103.82973,103.84245,103.76444,103.80969,103.84277,103.8401,103.85237,103.85587,103.85258,103.8751,103.86128,103.83751,103.86185,103.86186,103.78717,103.78768,103.85257,103.85257,103.85257,103.85257,103.85257,103.85257,103.73604,103.85021,103.85952,103.8525,103.77244,103.71947,103.85453,103.83976,103.69597,103.84245,103.94226,103.7872,103.75575,103.85278,103.86054,103.84535,103.75398,103.83518,103.80642,103.82417,103.84968,103.83818,103.80663,103.84332,103.84531,103.84764,103.85331,103.83142,103.8636,103.90706,103.85879,103.8587,103.75182,103.8473,103.84716,103.8421,103.83308,103.86042,103.83802,103.73559,103.8864,103.88974,103.84875,103.84848,103.75059,103.84913,103.86101,103.83366,103.84809,103.86253,103.83402,103.85129,103.88163,103.80644,103.83853,103.88073,103.80856,103.84049,103.8421,103.88228,103.88168,103.88525,103.88525,103.84396,103.84372,103.74169,103.88814,103.88525,103.88525,103.88525,103.88525,103.88525,103.88525,103.88525,103.88525,103.88525,103.88525,103.88525,103.85768,103.86357,103.85321,103.90344,103.83505,103.86176,103.84294,103.86179,103.86333,103.74423,103.88165,103.8588,103.88142,103.78647,103.91628,103.68678,103.78934,103.84365,103.81256,103.88637,103.77311,103.84294,103.74137,103.84464,103.90942,103.84294,103.8809,103.84476,103.8433,103.84535,103.84358,103.84395,103.76376,103.8082,103.88308,103.88249,103.87634,103.88222,103.88173,103.88297,103.78567,103.8615,103.85778,103.86078,103.84294,103.88433,103.78731,103.88163,103.86162,103.8851,103.8384,103.78645,103.85216,103.91351,103.91483,103.91408,103.91324,103.91371,103.86205,103.88176,103.83973,103.86176,103.78969,103.86191,103.92194,103.88525,103.84173,103.94427,103.88525,103.83895,103.92924,103.88525,103.74302,103.85056,103.84447,103.85077,103.85218,103.85072,103.83689,103.84294,103.76086,103.85104,103.84239,103.83803,103.88879,103.76562,103.85218,103.7236,103.84294,103.88244,103.74558,103.84777,103.85074,103.85007,103.84294,103.85382,103.85206,103.87322,103.85135,103.85088,103.84534,103.8322,103.88079,103.79311,103.78514,103.88995,103.86208,103.8371,103.84136,103.84053,103.80097,103.84336,103.88812,103.81954,103.83971,103.84107,103.7871,103.85257,103.84294,103.92682,103.85042,103.7869,103.85247,103.84294,103.88303,103.85898,103.85877,103.85914,103.85859,103.86027,103.86031,103.85871,103.85914,103.86005,103.85866,103.86005,103.85907,103.86056,103.85923,103.86087,103.84294,103.84063,103.84561,103.89768,103.83376,103.88163,103.88517,103.84294,103.84801,103.85419,103.83289,103.77675,103.85043,103.7851,103.85266,103.77138,103.85392,103.84625,103.85379,103.84883,103.8503,103.79686,103.84792,103.87833,103.84212,103.79723,103.79532,103.83976,103.83982,103.83258,103.83637,103.83816,103.84099,103.83846,103.88605,103.83682,103.83285,103.7487,103.85899,103.84526,103.89287,103.85674,103.96056,103.901,103.82882,103.85122,103.83718,103.85368,103.82294,103.82174,103.82157,103.82312,103.82767,103.82775,103.85653,103.84527,103.83683,103.82887,103.83071,103.83704,103.8373,103.83564,103.80857,103.76042,103.83987,103.83706,103.88674,103.84736,103.91314,103.9112,103.9109,103.91169,103.91149,103.91223,103.91085,103.91135,103.91274,103.91312,103.9124,103.75585,103.80514,103.8314,103.87476,103.76263,103.91267,103.91143,103.91097,103.91245,103.91112,103.91081,103.91274,103.91089,103.9123,103.91223,103.91139,103.91265,103.91174,103.91283,103.91079,103.91118,103.84243,103.78743,103.8196,103.84257,103.88601,103.82749,103.8325,103.88673,103.78771,103.73002,103.8405,103.86069,103.94263,103.86029,103.88163,103.8624,103.91184,103.85913,103.75729,103.84473,103.81803,103.74077,103.74101,103.84687,103.8498,103.84882,103.83977,103.84255,103.88056,103.79949,103.81138,103.67881,103.84008,103.94212,103.74639,103.85953,103.85845,103.85805,103.85984,103.85942,103.8449,103.84645,103.85877,103.85773,103.90076,103.89989,103.88163,103.89967,103.81144,103.85852,103.85277,103.84288,103.76331,103.84374,103.84208,103.84208,103.84374,103.83618,103.84208,103.83587,103.8366,103.84563,103.84554,103.84516,103.84969,103.83612,103.88709,103.86312,103.83839,103.85341,103.85279,103.85138,103.85186,103.85157,103.8529,103.8533,103.85279,103.85181,103.85301,103.85199,103.84945,103.84511,103.838,103.86028,103.86266,103.84865,103.8492,103.8271,103.7527,103.84236,103.84241,103.78607,103.92018,103.85431,103.8449,103.84255,103.86182,103.86198,103.88128,103.81693,103.84763,103.84255,103.88298,103.79687,103.83407,103.8351,103.84354,103.78711,103.84659,103.86065,103.8524,103.88199,103.91376,103.9135,103.91252,103.91237,103.86236,103.88157,103.84651,103.8424,103.71538,103.85309,103.88352,103.92735,103.84224,103.85207,103.85964,103.89745,103.85159,103.78538,103.85861,103.83444,103.79321,103.90675,103.86461,103.86292,103.84629,103.78684,103.83221,103.82622,103.84975,103.85321,103.89315,103.89306,103.8419,103.83876,103.84675,103.7843,103.84255,103.84984,103.95253,103.85006,103.75796,103.88163,103.85075,103.85039,103.8517,103.85055,103.84993,103.84222,103.85883,103.86039,103.84173,103.92836,103.84568,103.84625,103.83483,103.83408,103.83343,103.87048,103.83493,103.83557,103.83427,103.7229,103.91604,103.8533,103.8465,103.85223,103.78549,103.78541,103.80655,103.84959,103.8373,103.88158,103.88163,103.86284,103.86207,103.84688,103.9461,103.85001,103.84161,103.85871,103.82645,103.85209,103.85154,103.84183,103.87802,103.85034,103.8782,103.83143,103.86252,103.86105,103.82797,103.88163,103.88583,103.87745,103.87811,103.8777,103.95394,103.93409,103.84478,103.85813,103.79707,103.90004,103.85329,103.83642,103.74297,103.8452,103.84535,103.84014,103.85345,103.84507,103.79028,103.85316,103.85031,103.8451,103.85859,103.84753,103.84575,103.84587,103.86101,103.86063,103.84756,103.88501,103.84483,103.84483,103.84298,103.84152,103.95297,103.84167,103.85072,103.88124,103.88344,103.71273,103.86,103.82645,103.69699,103.88377,103.84502,103.88364,103.91035,103.85409,103.81059,103.83571,103.84773,103.90675,103.84264,103.9074,103.9069,103.71019,103.79551,103.84714,103.70045,103.84457,103.88141,103.86218,103.86578,103.87811,103.87599,103.87606,103.87792,103.87805,103.87772,103.87601,103.8777,103.70536,103.86118,103.86232,103.853,103.84869,103.88463,103.74129,103.88589,103.94608,103.88582,103.85943,103.88105,103.8518,103.87971,103.86319,103.86193,103.83274,103.83274,103.83274,103.83274,103.91865,103.84371,103.84364,103.8494,103.75582,103.85303,103.85036,103.86152,103.70775,103.78628,103.8414,103.85635,103.8877,103.69472,103.83686,103.83699,103.83591,103.69517,103.83318,103.83746,103.88159,103.86014,103.84789,103.85133,103.7497,103.84892,103.86305,103.77586,103.89019,103.84255,103.84035,103.96153,103.84433,103.84409,103.84407,103.84284,103.87314,103.84332,103.84763,103.87336,103.84166,103.84977,103.82749,103.87205,103.85339,103.88205,103.83988,103.74958,103.88618,103.86048,103.83693,103.85338,103.74616,103.81951,103.88781,103.88579,103.85975,103.85945,103.85994,103.86021,103.85958,103.86025,103.89967,103.84438,103.84649,103.85322,103.84673,103.84294,103.84351,103.84573,103.87846,103.88581,103.92257,103.89562,103.81926,103.79944,103.88136,103.8793,103.94571,103.88958,103.85371,103.69392,103.6913,103.87341,103.87192,103.8737,103.87397,103.87246,103.7886,103.8816,103.84476,103.86174,103.88163,103.91024,103.84702,103.86664,103.83025,103.84394,103.84342,103.8501,103.84403,103.84296,103.8421,103.85511,103.8452,103.84655,103.85946,103.88727,103.85341,103.84633,103.84681,103.83241,103.84544,103.84431,103.83941,103.88667,103.89068,103.74157,103.82983,103.84503,103.84658,103.85091,103.85035,103.74784,103.86236,103.8522,103.93392,103.84384,103.84559,103.82919,103.77719,103.86306,103.95313,103.86251,103.83461,103.84583,103.84423,103.85191,103.84255,103.8624,103.84392,103.8816,103.84692,103.85066,103.83379,103.84959,103.91363,103.84315,103.86246,103.8455,103.84548,103.85366,103.78548,103.8366,103.85095,103.87662,103.87596,103.8781,103.87745,103.8764,103.87794,103.90726,103.8816,103.85399,103.84523,103.91052,103.89337,103.87611,103.87669,103.87771,103.87596,103.878,103.87667,103.9329,103.85938,103.85234,103.84683,103.85335,103.74327,103.8617,103.74288,103.84312,103.84312,103.84277,103.84223,103.84312,103.84998,103.84934,103.84255,103.94632,103.85895,103.86036,103.84255,103.88163,103.84554,103.86053,103.84174,103.86161,103.84255,103.842,103.86371,103.86247,103.88036,103.85435,103.84255,103.83034,103.85871,103.9048,103.9609,103.75836,103.86216,103.8816,103.86028,103.85346,103.84258,103.8996,103.69335,103.88163,103.88704,103.86274,103.74979,103.86254,103.86062,103.86308,103.86156,103.81022,103.85141,103.86024,103.88497,103.88341,103.86134,103.84255,103.85809,103.90722,103.84183,103.85593,103.84309,103.88733,103.88362,103.95148,103.69009,103.69027,103.84792,103.8416,103.84935,103.85826,103.85798,103.84909,103.8474,103.84887,103.85312,103.84812,103.91354,103.86898,103.74201,103.87008,103.83941,103.77684,103.7422,103.83244,103.84674,103.85327,103.85808,103.85035,103.82835,103.80215,103.83841,103.88434,103.8414,103.8412,103.86033,103.84676,103.88886,103.84003,103.82434,103.85351,103.81456,103.94813,103.72228,103.86573,103.85997,103.92187,103.85615,103.8616,103.88264,103.84256,103.83404,103.93927,103.86091,103.90459,103.74502,103.88183,103.84318,103.85497,103.84319,103.88497,103.88497,103.86296,103.88497,103.7556,103.84142,103.86348,103.84389,103.8536,103.89857,103.86171,103.84523,103.8538,103.74347,103.87791,103.75775,103.89819,103.84071,103.86061,103.78556,103.88497,103.84518,103.8614,103.90356,103.82959,103.78532,103.87354,103.84545,103.84844,103.86133,103.86218,103.84367,103.83417,103.84455,103.83826,103.74262,103.74404,103.84917,103.86795,103.78621,103.79342,103.8567,103.89982,103.85234,103.84162,103.86301,103.86156,103.86352,103.86302,103.86146,103.86195,103.86169,103.86358,103.86353,103.86173,103.83417,103.84163,103.84255,103.75867,103.84127,103.83417,103.83417,103.88234,103.85895,103.86,103.85888,103.86751,103.84082,103.83438,103.83402,103.834,103.83417,103.86309,103.83433,103.84435,103.83784,103.83417,103.85152,103.8222,103.8462,103.83401,103.83395,103.84509,103.83678,103.84255,103.83383,103.83408,103.87972,103.84089,103.83714,103.88604,103.84888,103.86137,103.8457,103.86007,103.8593,103.86139,103.83408,103.83381,103.84152,103.86042,103.86166,103.85874,103.85332,103.80873,103.83417,103.90192,103.86583,103.86469,103.86445,103.86529,103.86558,103.86613,103.8646,103.86615,103.86411,103.86595,103.8662,103.86606,103.86528,103.8661,103.83395,103.86146,103.85161,103.84286,103.89029,103.8407,103.82637,103.83392,103.84714,103.82688,103.76825,103.83893,103.84281,103.85253,103.84467,103.94156,103.82723,103.69381,103.84212,103.83643,103.84649,103.93124,103.83723,103.86933,103.82994,103.90614,103.82954,103.83093,103.86337,103.86028,103.85993,103.85947,103.85401,103.85962,103.8594,103.85857,103.85968,103.83243,103.85346,103.85386,103.86406,103.85911,103.84819,103.74117,103.84253,103.91483,103.84306,103.85267,103.83134,103.84253,103.9617,103.85897,103.85741,103.85716,103.85697,103.96182,103.84253,103.84053,103.85853,103.86138,103.84547,103.84478,103.85411,103.83515,103.85379,103.74365,103.83955,103.80676,103.78645,103.84314,103.84505,103.84316,103.8431,103.84356,103.86118,103.88163,103.82778,103.84392,103.80767,103.83262,103.85074,103.84157,103.81915,103.85138,103.85345,103.85169,103.85327,103.85189,103.85176,103.82673,103.84219,103.8517,103.86056,103.85181,103.84483,103.84483,103.84685,103.88163,103.87973,103.74312,103.84819,103.86332,103.75033,103.84208,103.85784,103.85365,103.76607,103.86822,103.90715,103.84995,103.85217,103.8496,103.85249,103.9215,103.82942,103.84135,103.85113,103.85188,103.84263,103.85473,103.86202,103.84311,103.85398,103.88584,103.88663,103.84155,103.72927,103.85135,103.843,103.82642,103.88132,103.85895,103.85251,103.9043,103.83007,103.85578,103.88163,103.88163,103.84331,103.86169,103.86073,103.84562,103.88002,103.88163,103.88749,103.88716,103.84641,103.84787,103.84697,103.84771,103.84253,103.84736,103.84304,103.84293,103.84266,103.8439,103.7433,103.85195,103.85189,103.85689,103.8485,103.84797,103.84849,103.85294,103.85595,103.85184,103.85598,103.86266,103.83086,103.83366,103.80608,103.85396,103.84507,103.84253,103.90044,103.87061,103.75103,103.84954,103.85598,103.82653,103.83325,103.84337,103.83217,103.83383,103.8582,103.8334,103.8317,103.76254,103.83318,103.83374,103.79546,103.84979,103.83553,103.84325,103.85968,103.82815,103.83673,103.84691,103.77186,103.77258,103.859,103.83931,103.839,103.94607,103.80702,103.84811,103.88686,103.88573,103.8394,103.85869,103.76412,103.86192,103.7626,103.86285,103.85799,103.87882,103.83903,103.84074,103.87723,103.87895,103.87769,103.87756,103.87922,103.87918,103.87735,103.87878,103.87892,103.87896,103.87948,103.83507,103.85861,103.83421,103.8357,103.84253,103.85765,103.85761,103.85951,103.85792,103.84922,103.85002,103.84895,103.84253,103.93961,103.81921,103.84845,103.88381,103.85361,103.84711,103.85363,103.82068,103.83376,103.83161,103.84807,103.7987,103.86378,103.88495,103.84845,103.84218,103.84141,103.85854,103.9454,103.94649,103.82818,103.78022,103.90057,103.72175,103.7675,103.88654,103.88826,103.83085,103.84901,103.84192,103.79719,103.85379,103.8466,103.7788,103.841,103.88124,103.83934,103.84009,103.86214,103.89582,103.8463,103.84163,103.84823,103.84254,103.80037,103.86144,103.8267,103.95001,103.79897,103.74278,103.90109,103.85101,103.84527,103.84457,103.84477,103.84527,103.84527,103.84527,103.84527,103.84527,103.84527,103.84476,103.84527,103.84073,103.75743,103.86315,103.86314,103.86205,103.86141,103.86166,103.86305,103.86763,103.88112,103.88137,103.8828,103.84026,103.89211,103.8412,103.78303,103.89876,103.92891,103.908,103.84253,103.84579,103.84533,103.8458,103.84511,103.87541,103.84683,103.70209,103.83405,103.83405,103.833,103.83405,103.84397,103.88672,103.87774,103.82797,103.82742,103.82661,103.78013,103.7597,103.85202,103.76851,103.86263,103.84563,103.8612,103.85813,103.84253,103.8403,103.94595,103.87197,103.88521,103.85774,103.88547,103.88682,103.83868,103.84071,103.71855,103.87263,103.71728,103.85824,103.85478,103.85993,103.84648,103.84712,103.85968,103.86125,103.76022,103.80993,103.86214,103.85843,103.85874,103.84091,103.84185,103.84701,103.88601,103.84668,103.88607,103.84567,103.873,103.84446,103.85831,103.85635,103.86162,103.84545,103.84182,103.84707,103.84027,103.94254,103.83427,103.84023,103.81893,103.86232,103.84092,103.85352,103.85843,103.8535,103.85826,103.85107,103.84255,103.83745,103.96651,103.85467,103.79757,103.84593,103.85523,103.85353,103.85328,103.85505,103.85507,103.8532,103.85505,103.84927,103.84967,103.84936,103.85106,103.84904,103.84959,103.84092,103.86352,103.88163,103.83094,103.85254,103.84116,103.86118,103.86108,103.94552,103.83851,103.83781,103.83364,103.8511,103.78619,103.78781,103.82625,103.85991,103.84092,103.85338,103.84055,103.84625,103.84517,103.88196,103.84372,103.84379,103.84525,103.84232,103.85195,103.88604,103.88717,103.84252,103.69798,103.85751,103.85459,103.85497,103.84618,103.8643,103.84121,103.87216,103.87165,103.8251,103.87166,103.8259,103.8545,103.84107,103.77936,103.86132,103.83387,103.84505,103.83518,103.86016,103.83792,103.84912,103.80677,103.8389,103.83964,103.83848,103.85952,103.83951,103.76282,103.85431,103.88135,103.86277,103.84967,103.84086,103.84358,103.84067,103.83868,103.74362,103.85266,103.88575,103.84186,103.7976,103.88686,103.88279,103.7257,103.86738,103.88592,103.88828,103.85985,103.87948,103.85985,103.83904,103.82946,103.78507,103.8457,103.84629,103.84611,103.85209,103.8513,103.85296,103.85331,103.85293,103.82756,103.82607,103.89816,103.82758,103.85335,103.85246,103.83514,103.8281,103.83508,103.88687,103.86118,103.85746,103.85803,103.85839,103.82636,103.85854,103.86166,103.86044,103.85825,103.84932,103.85966,103.86008,103.85868,103.86166,103.86044,103.8894,103.85901,103.86007,103.83205,103.83083,103.79643,103.86229,103.84517,103.78661,103.84484,103.86102,103.80008,103.84772,103.84253,103.86169,103.85913,103.85928,103.84718,103.84551,103.77982,103.84703,103.73694,103.8871,103.85352,103.83478,103.86049,103.84279,103.84098,103.79386,103.88225,103.82868,103.79093,103.88073,103.85079,103.84483,103.83883,103.83893,103.84037,103.86231,103.96206,103.8256,103.88742,103.88579,103.8858,103.88692,103.88517,103.88534,103.86011,103.84118,103.83797,103.83312,103.8327,103.8428,103.84673,103.8445,103.85119,103.85246,103.86969,103.85325,103.85377,103.85323,103.85485,103.85465,103.85354,103.85453,103.80529,103.80358,103.88293,103.86024,103.86156,103.85438,103.85486,103.86154,103.8625,103.84445,103.88017,103.88493,103.88622,103.88629,103.85853,103.87315,103.88111,103.84529,103.88163,103.85743,103.85777,103.84376,103.84324,103.84467,103.84506,103.84519,103.84342,103.84486,103.84373,103.84519,103.84462,103.84466,103.84503,103.86073,103.84863,103.84847,103.84834,103.84855,103.84739,103.86045,103.83789,103.85776,103.84603,103.8252,103.84473,103.84188,103.8782,103.87656,103.84538,103.84688,103.71614,103.95894,103.86595,103.86583,103.86849,103.86899,103.94922,103.87167,103.83302,103.8821,103.86044,103.76361,103.8349,103.84079,103.84079,103.95654,103.88512,103.91004,103.83629,103.83478,103.83649,103.71217,103.83283,103.86599,103.84704,103.89292,103.82075,103.86113,103.82643,103.9085,103.87744,103.87776,103.82028,103.86412,103.84786,103.84697,103.83692,103.88021,103.81101,103.78052,103.81998,103.87872,103.75713,103.86453,103.86207,103.84477,103.82727,103.75958,103.86007,103.8842,103.86141,103.85819,103.84286,103.84169,103.84325,103.83231,103.83357,103.9314,103.73797,103.83932,103.83233,103.86283,103.74518,103.85129,103.83287,103.81983,103.88857,103.79572,103.79127,103.79168,103.89757,103.85329,103.7889,103.7993,103.8484,103.87745,103.88729,103.8465,103.81968,103.87578,103.85378,103.85383,103.88418,103.7807,103.85206,103.86338,103.86574,103.85144,103.84702,103.82936,103.84356,103.84715,103.88191,103.89653,103.84236,103.77529,103.8647,103.84699,103.80741,103.87864,103.90327,103.87746,103.87951,103.86329,103.86148,103.8463,103.84449,103.8847,103.84194,103.84284,103.88282,103.86409,103.83528,103.83431,103.83565,103.8656,103.82757,103.76107,103.73987,103.84425,103.85312,103.85362,103.84015,103.83319,103.83978,103.83356,103.83283,103.83369,103.76333,103.86574,103.7707,103.89942,103.80687,103.83246,103.83498,103.83431,103.8407,103.8458,103.80607,103.83362,103.83244,103.88573,103.84621,103.83455,103.72475,103.83414,103.83466,103.84925,103.85609,103.80667,103.85295,103.85325,103.83426,103.84687,103.83346,103.83264,103.83469,103.84687,103.82672,103.83399,103.83409,103.83443,103.83341,103.90835,103.88676,103.83307,103.8324,103.83328,103.83432,103.83418,103.7652,103.85293,103.85522,103.81961,103.76267,103.70018,103.86013,103.84858,103.88669,103.89944,103.83316,103.85897,103.89948,103.90807,103.80662,103.86,103.84478,103.83291,103.84208,103.83293,103.83313,103.86003,103.84526,103.84253,103.84334,103.85325,103.89944,103.84019,103.90187,103.90234,103.90108,103.87637,103.78738,103.90284,103.903,103.83366,103.85283,103.82862,103.78587,103.78561,103.78757,103.90052,103.83083,103.83387,103.76953,103.78681,103.78593,103.78753,103.86512,103.89153,103.78556,103.83511,103.83475,103.83321,103.83244,103.80467,103.84195,103.85287,103.84195,103.88336,103.8537,103.85856,103.95814,103.76181,103.85194,103.87606,103.88591,103.88525,103.85728,103.86505,103.86392,103.83482,103.83538,103.76464,103.76715,103.88687,103.85889,103.85905,103.8583,103.85726,103.90291,103.90313,103.90104,103.90243,103.76631,103.88722,103.88549,103.85166,103.84909,103.84862,103.84748,103.84823,103.84196,103.88495,103.90313,103.84846,103.84657,103.8489,103.86048,103.87609,103.87793,103.87806,103.87676,103.88648,103.8851,103.83168,103.87263,103.83587,103.84636,103.85556,103.83327,103.85622,103.88233,103.85367,103.85369,103.85991,103.85928,103.78379,103.8607,103.87813,103.88272,103.88439,103.86021,103.8614,103.86005,103.8399,103.86086,103.86083,103.8252,103.83938,103.83865,103.78669,103.86165,103.90159,103.90264,103.87655,103.87642,103.86114,103.87598,103.86449,103.77853,103.85286,103.83847,103.8552,103.86258,103.8468,103.85644,103.85613,103.80553,103.83345,103.85811,103.86023,103.76814,103.83793,103.85642,103.78722,103.76917,103.86079,103.88874,103.7696,103.7868,103.78534,103.86513,103.86595,103.78109,103.85048,103.85546,103.84823,103.86164,103.87985,103.85239,103.88833,103.8668,103.86784,103.84908,103.84552,103.85559,103.84592,103.85515,103.85588,103.85542,103.85392,103.85596,103.85527,103.85436,103.80559,103.83418,103.88274,103.8285,103.84828,103.8619,103.84121,103.89284,103.82544,103.84233,103.84068,103.71939,103.83056,103.86682,103.82635,103.85368,103.86839,103.86688,103.89951,103.84937,103.85327,103.85298,103.8545,103.84449,103.84591,103.84552,103.83209,103.83685,103.85336,103.85072,103.86283,103.85119,103.88489,103.83029,103.8479,103.86324,103.87959,103.885,103.85934,103.85507,103.85297,103.85066,103.84524,103.86301,103.86015,103.84887,103.84439,103.85337,103.85332,103.86818,103.86673,103.8835,103.86515,103.86365,103.84118,103.87968,103.86303,103.82053,103.85187,103.8206,103.82067,103.87725,103.83498,103.8758,103.85773,103.85682,103.85576,103.85696,103.85369,103.8532,103.89331,103.84309,103.84296,103.84378,103.81015,103.84959,103.78891,103.85726,103.84941,103.85445,103.85185,103.84151,103.84572,103.8473,103.84886,103.86066,103.79076,103.87755,103.76799,103.81926,103.82057,103.8816,103.83957,103.86112,103.83272,103.84834,103.85018,103.83781,103.85457,103.86289,103.74099,103.85762,103.84243,103.85321,103.90103,103.83894,103.83754,103.83825,103.83189,103.83864,103.84494,103.70823,103.87895,103.84422,103.84461,103.86473,103.85622,103.79365,103.84658,103.85124,103.84587,103.84969,103.8354,103.84725,103.80423,103.846,103.8366,103.84724,103.85131,103.84611,103.85111,103.85784,103.84899,103.85042,103.84982,103.84887,103.85062,103.72995,103.844,103.85019,103.85004,103.85214,103.83058,103.8439,103.84219,103.84559,103.84422,103.82887,103.87024,103.85355,103.86102,103.80768,103.70398,103.70528,103.83011,103.85774,103.70403,103.86004,103.86144,103.83929,103.84065,103.93064,103.84495,103.85871,103.86062,103.8603,103.86054,103.84447,103.83289,103.85944,103.84359,103.88373,103.83659,103.84462,103.8607,103.86202,103.7061,103.85269,103.84677,103.88186,103.86039,103.85863,103.86034,103.85936,103.85518,103.85506,103.89779,103.86335,103.85696,103.8597,103.8443,103.78948,103.84456,103.84441,103.78483,103.86198,103.71716,103.81946,103.85096,103.84414,103.85056,103.82582,103.82627,103.88202,103.84378,103.88074,103.85102,103.84722,103.88535,103.74127,103.72876,103.87548,103.87528,103.87601,103.84981,103.84243,103.86144,103.82712,103.77876,103.87736,103.78005,103.84401,103.84374,103.84502,103.86176,103.75249,103.87708,103.94977,103.84836,103.8437,103.84671,103.83227,103.88237,103.7765,103.86027,103.83442,103.74181,103.8059,103.83042,103.8616,103.75786,103.85774,103.85546,103.85708,103.84392,103.84498,103.84514,103.85196,103.84091,103.84578,103.83219,103.82671,103.81474,103.78592,103.84068,103.85775,103.84748,103.84796,103.84888,103.8637,103.76106,103.85936,103.83978,103.8356,103.85826,103.85176,103.85042,103.85198,103.91944,103.82005,103.84768,103.89173,103.86788,103.84429,103.88492,103.78691,103.84254,103.82667,103.8486,103.85551,103.85757,103.85712,103.85203,103.85025,103.90686,103.84673,103.80795,103.80662,103.91409,103.9135,103.9153,103.9146,103.91328,103.91364,103.91415,103.91355,103.78356,103.85463,103.85535,103.93567,103.89827,103.83953,103.76519,103.85562,103.85451,103.76804,103.87909,103.73712,103.82063,103.85367,103.85452,103.85313,103.84426,103.84419,103.80812,103.84103,103.84185,103.93463,103.80588,103.8052,103.91484,103.91459,103.80713,103.80611,103.91478,103.91411,103.9154,103.91374,103.84018,103.8392,103.85248,103.7689,103.86211,103.85423,103.87867,103.87769,103.90071,103.71483,103.8634,103.85769,103.78593,103.83475,103.82794,103.88243,103.69858,103.84562,103.90249,103.90228,103.88951,103.84367,103.84536,103.84733,103.84151,103.80862,103.84686,103.8069,103.87748,103.84435,103.84614,103.80437,103.83596,103.84542,103.84624,103.84599,103.84537,103.84579,103.85864,103.84359,103.84278,103.84573,103.84363,103.90253,103.85318,103.84562,103.85722,103.85854,103.85225,103.88644,103.87746,103.87926,103.84497,103.83979,103.85059,103.85491,103.85419,103.88206,103.85485,103.85341,103.85444,103.88932,103.85256,103.85308,103.85217,103.85166,103.8845,103.82732,103.85402,103.85526,103.85243,103.88104,103.83618,103.83658,103.8665,103.82901,103.85489,103.85144,103.8378,103.83644,103.93912,103.8528,103.85408,103.85253,103.85759,103.83513,103.88095,103.84537,103.85013,103.85763,103.86352,103.88977,103.85174,103.85302,103.85268,103.91423,103.78825,103.85617,103.8825,103.8532,103.82653,103.82479,103.84381,103.84576,103.84864,103.85087,103.88293,103.88455,103.83832,103.8627,103.85314,103.84426,103.8432,103.85317,103.85168,103.85185,103.7622,103.80353,103.89823,103.83772,103.86642,103.86099,103.88248,103.8528,103.85186,103.85333,103.85138,103.85644,103.85163,103.85331,103.88497,103.78419,103.85348,103.8532,103.85475,103.85362,103.85479,103.85459,103.8559,103.84914,103.88594,103.91905,103.83553,103.8438,103.85193,103.85092,103.85095,103.85275,103.85164,103.84591,103.88373,103.85873,103.85202,103.83921,103.90103,103.90025,103.85633,103.85358,103.84653,103.74509,103.76964,103.84205,103.84783,103.84856,103.83729,103.72805,103.84515,103.88446,103.93816,103.80573,103.85027,103.79439,103.86278,103.83877,103.94959,103.85382,103.85491,103.8532,103.85296,103.84782,103.85391,103.85327,103.85313,103.85578,103.85487,103.85558,103.85427,103.85569,103.85597,103.85549,103.85473,103.84525,103.86137,103.85563,103.88575,103.85296,103.85378,103.85437,103.85349,103.85385,103.85305,103.86154,103.74238,103.93275,103.90076,103.90215,103.86662,103.86742,103.86829,103.76798,103.84054,103.8465,103.85127,103.85059,103.84111,103.8462,103.84447,103.8533,103.85388,103.85379,103.85253,103.85248,103.85369,103.90059,103.90159,103.85386,103.85302,103.85489,103.83671,103.8553,103.85524,103.85744,103.85566,103.85666,103.85678,103.85544,103.85438,103.85375,103.85209,103.86815,103.86647,103.85208,103.86795,103.85435,103.85364,103.85349,103.85461,103.85342,103.85325,103.83687,103.85374,103.85487,103.85341,103.85437,103.85487,103.8847,103.86203,103.84199,103.85998,103.83301,103.85903,103.84491,103.89814,103.81112,103.83765,103.82961,103.84374,103.86026,103.85065,103.86307,103.83335,103.84581,103.84486,103.86771,103.86665,103.86875,103.84097,103.86317,103.90885,103.88622,103.85105,103.85204,103.85172,103.85172,103.85121,103.83382,103.85075,103.83723,103.83737,103.82332,103.8371,103.91285,103.84571,103.83536,103.83403,103.8359,103.83431,103.83752,103.84523,103.88706,103.84686,103.83311,103.84568,103.85044,103.83927,103.87997,103.84337,103.8474,103.83736,103.85162,103.83229,103.80758,103.85597,103.8557,103.84589,103.84097,103.88586,103.85753,103.85833,103.89905,103.84628,103.84245,103.84159,103.84104,103.84298,103.84169,103.84308,103.84149,103.84174,103.80514,103.84621,103.92316,103.85262,103.85336,103.84722,103.8425,103.82833,103.84392,103.84434,103.80698,103.88031,103.88038,103.87966,103.74241,103.7431,103.85488,103.89793,103.85396,103.85438,103.86767,103.86919,103.85389,103.87906,103.88011,103.85243,103.84519,103.94156,103.88056,103.77065,103.77094,103.8616,103.85627,103.85543,103.85693,103.84853,103.85272,103.84894,103.84859,103.84887,103.84982,103.85489,103.85055,103.84946,103.84927,103.85068,103.89982,103.88065,103.8549,103.88228,103.84664,103.85162,103.85237,103.8861,103.90824,103.85351,103.85374,103.8553,103.78435,103.76839,103.85674,103.85674,103.85674,103.85674,103.85674,103.85674,103.85463,103.8532,103.85674,103.85529,103.85674,103.85674,103.85674,103.85674,103.85674,103.85674,103.85674,103.85674,103.89711,103.77719,103.83064,103.84623,103.8451,103.84496,103.86026,103.86025,103.78456,103.79148,103.78993,103.80584,103.84546,103.76752,103.86036,103.84024,103.84104,103.84048,103.84197,103.84244,103.84113,103.84223,103.84215,103.84185,103.84086,103.83814,103.86767,103.82806,103.85829,103.83956,103.90585,103.90346,103.86298,103.85164,103.83057,103.83984,103.8345,103.83382,103.83248,103.80813,103.80803,103.85019,103.84613,103.84781,103.74511,103.84489,103.76514,103.76418,103.76432,103.76402,103.83524,103.8346,103.76559,103.76566,103.7646,103.8465,103.78621,103.78621,103.88302,103.84878,103.84412,103.81943,103.83845,103.84229,103.84099,103.76117,103.84553,103.8461,103.76286,103.74279,103.75226,103.84813,103.846,103.85259,103.84763,103.84634,103.84648,103.84595,103.8462,103.85189,103.85189,103.85924,103.91369,103.85309,103.85384,103.85437,103.83397,103.84307,103.80705,103.8338,103.84609,103.83299,103.83435,103.83788,103.71037,103.80595,103.83121,103.76054,103.94031,103.80519,103.84543,103.78778,103.78628,103.84512,103.78392,103.82999,103.8614,103.84973,103.83309,103.83265,103.84495,103.85181,103.78486,103.84569,103.82413,103.90125,103.85238,103.8469,103.84762,103.83396,103.85129,103.8595,103.85119,103.85128,103.8526,103.85225,103.85295,103.83173,103.85201,103.85409,103.85216,103.84742,103.84532,103.84812,103.84675,103.84856,103.83503,103.84729,103.78794,103.83842,103.82882,103.84456,103.80956,103.90297,103.85266,103.85495,103.85302,103.76951,103.80823,103.8058,103.93282,103.89009,103.84004,103.84001,103.83968,103.84007,103.84001,103.83843,103.83957,103.83841,103.84021,103.83227,103.83865,103.9713,103.86338,103.83847,103.83526,103.84496,103.84008,103.84189,103.84646,103.76071,103.82953,103.80994,103.88006,103.88366,103.83455,103.84471,103.84164,103.85931,103.86029,103.81323,103.8584,103.85961,103.85894,103.88999,103.83384,103.78793,103.78898,103.74449,103.95627,103.83975,103.84024,103.83305,103.84428,103.86487,103.8341,103.71346,103.94526,103.84553,103.85377,103.84461,103.90368,103.83512],10,null,null,{"interactive":true,"className":"","stroke":true,"color":"#03F","weight":5,"opacity":0.5,"fill":true,"fillColor":"#03F","fillOpacity":0.2},{"showCoverageOnHover":true,"zoomToBoundsOnClick":true,"spiderfyOnMaxZoom":true,"removeOutsideVisibleBounds":true,"spiderLegPolylineOptions":{"weight":1.5,"color":"#222","opacity":0.5},"freezeAtZoom":false},null,null,null,["FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","TRUE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","TRUE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","TRUE","TRUE","FALSE","FALSE","FALSE","TRUE","TRUE","TRUE","FALSE","FALSE","FALSE","TRUE","TRUE","TRUE","TRUE","TRUE","TRUE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","TRUE","FALSE","TRUE","TRUE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","TRUE","FALSE","TRUE","TRUE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","TRUE","TRUE","TRUE","FALSE","TRUE","FALSE","TRUE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","TRUE","FALSE","TRUE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","TRUE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","TRUE","TRUE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","TRUE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","TRUE","TRUE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","TRUE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","TRUE","TRUE","TRUE","TRUE","TRUE","TRUE","TRUE","FALSE","TRUE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","TRUE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","TRUE","TRUE","TRUE","FALSE","FALSE","FALSE","FALSE","TRUE","TRUE","TRUE","TRUE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","TRUE","TRUE","TRUE","TRUE","FALSE","FALSE","FALSE","TRUE","FALSE","TRUE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","TRUE","TRUE","TRUE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","TRUE","FALSE","FALSE","TRUE","FALSE","TRUE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","TRUE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","TRUE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","TRUE","FALSE","FALSE","TRUE","FALSE","FALSE","TRUE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","TRUE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","TRUE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","TRUE","FALSE","FALSE","TRUE","FALSE","TRUE","TRUE","TRUE","TRUE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","TRUE","FALSE","FALSE","TRUE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","TRUE","FALSE","FALSE","TRUE","TRUE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","TRUE","FALSE","TRUE","TRUE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","TRUE","FALSE","FALSE","FALSE","TRUE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","TRUE","FALSE","FALSE","TRUE","FALSE","TRUE","TRUE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","TRUE","TRUE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","TRUE","TRUE","TRUE","TRUE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","TRUE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","TRUE","FALSE","FALSE","FALSE","TRUE","TRUE","TRUE","TRUE","TRUE","TRUE","TRUE","TRUE","TRUE","TRUE","TRUE","TRUE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","TRUE","TRUE","FALSE","FALSE","TRUE","FALSE","TRUE","TRUE","TRUE","TRUE","TRUE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","TRUE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","TRUE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","TRUE","TRUE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","TRUE","TRUE","TRUE","TRUE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","TRUE","TRUE","FALSE","FALSE","FALSE","FALSE","TRUE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","TRUE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","TRUE","FALSE","FALSE","FALSE","TRUE","TRUE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","TRUE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","TRUE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","TRUE","FALSE","FALSE","TRUE","FALSE","FALSE","TRUE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","TRUE","FALSE","TRUE","TRUE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","TRUE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","TRUE","TRUE","FALSE","FALSE","TRUE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","TRUE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","TRUE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","TRUE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","TRUE","TRUE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","TRUE","FALSE","TRUE","FALSE","TRUE","FALSE","TRUE","TRUE","TRUE","TRUE","FALSE","FALSE","TRUE","TRUE","TRUE","FALSE","FALSE","TRUE","TRUE","TRUE","FALSE","TRUE","TRUE","FALSE","FALSE","FALSE","TRUE","TRUE","TRUE","FALSE","FALSE","FALSE","FALSE","TRUE","TRUE","TRUE","TRUE","TRUE","FALSE","TRUE","FALSE","TRUE","TRUE","TRUE","TRUE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","TRUE","TRUE","TRUE","TRUE","TRUE","TRUE","TRUE","TRUE","TRUE","TRUE","FALSE","FALSE","FALSE","TRUE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","TRUE","TRUE","TRUE","TRUE","TRUE","TRUE","TRUE","TRUE","TRUE","TRUE","TRUE","TRUE","TRUE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","TRUE","FALSE","TRUE","TRUE","TRUE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","TRUE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","TRUE","TRUE","FALSE","TRUE","TRUE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","TRUE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","TRUE","TRUE","FALSE","TRUE","TRUE","TRUE","TRUE","TRUE","TRUE","TRUE","TRUE","TRUE","TRUE","TRUE","TRUE","FALSE","TRUE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","TRUE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","TRUE","TRUE","FALSE","FALSE","FALSE","FALSE","TRUE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","TRUE","TRUE","TRUE","TRUE","TRUE","TRUE","TRUE","TRUE","TRUE","TRUE","FALSE","FALSE","TRUE","TRUE","TRUE","TRUE","TRUE","TRUE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","TRUE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","TRUE","TRUE","TRUE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","TRUE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","TRUE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","TRUE","TRUE","TRUE","TRUE","TRUE","TRUE","TRUE","TRUE","TRUE","TRUE","TRUE","TRUE","TRUE","TRUE","FALSE","TRUE","TRUE","TRUE","TRUE","TRUE","FALSE","TRUE","TRUE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","TRUE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","TRUE","TRUE","TRUE","TRUE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","TRUE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","TRUE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","TRUE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","TRUE","TRUE","FALSE","TRUE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","TRUE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","TRUE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","TRUE","TRUE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","TRUE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","TRUE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","TRUE","TRUE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","TRUE","TRUE","TRUE","TRUE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","TRUE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","TRUE","TRUE","FALSE","TRUE","TRUE","TRUE","TRUE","TRUE","TRUE","TRUE","TRUE","FALSE","TRUE","TRUE","FALSE","TRUE","FALSE","FALSE","TRUE","TRUE","FALSE","TRUE","FALSE","FALSE","TRUE","FALSE","TRUE","TRUE","FALSE","TRUE","TRUE","FALSE","FALSE","FALSE","TRUE","TRUE","TRUE","FALSE","TRUE","TRUE","TRUE","TRUE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","TRUE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","TRUE","TRUE","FALSE","FALSE","FALSE","FALSE","TRUE","TRUE","FALSE","TRUE","FALSE","FALSE","TRUE","TRUE","TRUE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","TRUE","TRUE","TRUE","TRUE","TRUE","TRUE","TRUE","FALSE","FALSE","TRUE","FALSE","TRUE","TRUE","TRUE","TRUE","TRUE","TRUE","TRUE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","FALSE","TRUE","FALSE","TRUE","FALSE","FALSE"],{"interactive":false,"permanent":false,"direction":"auto","opacity":1,"offset":[0,0],"textsize":"10px","textOnly":false,"className":"","sticky":true},null]}],"limits":{"lat":[1.2453,1.45328],"lng":[103.6637,103.9713]}},"evals":[],"jsHooks":[]}</script>
```


#### 4.4.2 Chloropleth Map

**With `tmap`**

When using `tmap` for chloropleth mapping, the dataset had to be summarised prior to joining with the subzone data. This may be tricky to implement using the reactive function of Shiny to summarise the dataset for mapping. We also experienced some trouble adding _avg_price_ to the tooltip.


```r
# load subzone map
mpsz2 <- st_read(dsn = 'data/spatial',
                layer = 'MP14_SUBZONE_WEB_PL', 
                quiet = TRUE) %>%
  group_by(PLN_AREA_N) %>%
  summarise(geometry = sf::st_union(geometry))

# collapse dataframe and summarise price by neighbourhood
listing_summary <- final_listing %>% 
  group_by(neighbourhood_cleansed) %>%
  summarise(count = n(),
            avg_price = mean(price),
            min_price = min(price),
            max_price = max(price)) %>%
  mutate_at(.vars = vars(neighbourhood_cleansed), .funs= funs(toupper))

# join by neighbourhood and planning area
airbnb_map <- right_join(mpsz2,listing_summary, c("PLN_AREA_N" = 'neighbourhood_cleansed'))

# create map
map <- tm_shape(mpsz2)+
  tm_polygons()+
  tm_shape(airbnb_map) +
    tm_fill('avg_price',
            n = 6,
            style = 'quantile',
            palette = 'Blues')+
    tm_borders(alpha = 0.5) 

# make map interactive
tmap_mode('view')
c_map <- tmap_leaflet(map) #blogdown unable to render interactive tmap
frameWidget(c_map)
```

```{=html}
<div id="htmlwidget-ae8235faa552c26d571b" style="width:100%;height:480px;" class="widgetframe html-widget"></div>
<script type="application/json" data-for="htmlwidget-ae8235faa552c26d571b">{"x":{"url":"index_files/figure-html//widgets/widget_unnamed-chunk-26.html","options":{"xdomain":"*","allowfullscreen":false,"lazyload":false}},"evals":[],"jsHooks":[]}</script>
```



**With `leaflet`**

Plotting the chloropleth map using _geojson_ data extracted from [InsideAirbnb](http://insideairbnb.com/get-the-data.html). We felt that `leaflet` was relatively straight forward and easy to customise compared to using the subzone file and `tmap`.

However, we noted that the mapping of the neighbourhoods is not accurate. We are investigating this issue.  


```r
# load geojson file
hood <- geojsonio::geojson_read('data/neighbourhoods.geojson', what = 'sp')

# assign palette based on numeric factors
mypalette <- colorNumeric("viridis", NULL , reverse = TRUE)
labels <- sprintf(
  "<strong>%s</strong><br/> Avg price: $%g",
  listing_summary$neighbourhood_cleansed, round(listing_summary$avg_price,1)
) %>% lapply(htmltools::HTML)

# create map
l_m <- leaflet(hood) %>%
  addTiles() %>%
  addProviderTiles('Esri.WorldGrayCanvas') %>% #grey background
  addPolygons(stroke = TRUE,
              color = 'white',
              weight = 1,
              smoothFactor = 0.3,
              fillOpacity = 1,
              fillColor = ~mypalette(log10(listing_summary$avg_price)), #log for better differentiation 
              label = labels) %>%
  addLegend("bottomright", pal = mypalette, values = ~listing_summary$avg_price,
    title = "Avg Price",
    labFormat = labelFormat(prefix = "$"),
    opacity = 1
  )
frameWidget(l_m)
```

```{=html}
<div id="htmlwidget-bfd41dd6cbe5fcd93b76" style="width:100%;height:480px;" class="widgetframe html-widget"></div>
<script type="application/json" data-for="htmlwidget-bfd41dd6cbe5fcd93b76">{"x":{"url":"index_files/figure-html//widgets/widget_unnamed-chunk-27.html","options":{"xdomain":"*","allowfullscreen":false,"lazyload":false}},"evals":[],"jsHooks":[]}</script>
```


## 5. Testing Shiny interface

Given that our main deliverable is a R Shiny application, we tested the compatibility of both `ggstatsplot` and `ggplot2` with R Shiny, taking ease of scripting and transitioning into consideration.

### 5.1 R Shiny with `ggstatsplot`

During our experiment, we noticed that `ggstatsplot` tends to take a little longer to transition from one plot to another, especially when toggling the statistical approach. Furthermore, we were unable to implement toggling the adjustment method and pairwise display using the typical Shiny input.


![](images/ggstatsplot.gif)


Code below


```r
bscols(widths = c(3,9),
  list(selectInput(inputId = 'x_cda',
                   label = 'Select x-variable',
                   choices = sort(colnames(listing_cat)),
                   selected = 'host_is_superhost'),
       
       selectInput(inputId = 'y_cda',
                   label = 'Select y-variable',
                   choices = sort(colnames(listing_num)),
                   selected = 'price_per_pax'),
       
       selectInput(inputId = 'type',
                   label = 'Select statistical approach ',
                   choices = c("parametric", 'nonparametric','robust','bayes'),
                   selected = 'parametric'),
       
       selectInput(inputId = 'pairwise',
                   label = 'Select pairwise option ',
                   choices = c("significant", 'non-significant','all'),
                   selected = 'significant'),
       
       selectInput(inputId = 'p_adj',
                   label = 'Select adjustment method of p-values ',
                   choices = c("holm", 'hochberg','hommel','bonferroni', 'BH', 'BY', 'fdr', 'none'),
                   selected = 'holm'),
       
       sliderInput(inputId = 'conf_lev2',
                   label = "Confidence Interval",
                   min = 0,
                   max = 1,
                   value = 0.95)),
       
      renderPlot({ggbetweenstats(
        data = listing_prep,
        x = !!colnames(listing_prep[input$x_cda]), 
        y = !!colnames(listing_prep[input$y_cda]), 
        title = paste('Comparison of ', input$y_cda, ' by ', input$x_cda),
        type = input$type,
        conf.level = input$conf_lev2,
        pairwise.comparisons = TRUE,
        pairwise.display = input$pairwise, #not working
        p.adjust.method = input$p_adj, #not working
        ggtheme = ggplot2::theme_classic())
        })
)
```



### 5.2 R Shiny with `ggplot2`

Syncing `ggplot2` charts with Shiny was relatively straight forward, we did not encounter any issues during our testing.


![](images/ggplot.gif)

Code below.


```r
output$bbox <- renderPlotly({
  x_b_cat <- unlist(listing_prep[,input$x_b_cat])
  
  y_num <- unlist(listing_prep[,input$y_b_num])
  
  ccat <- if(input$box_colour == 'None'){'None'} 
          else {unlist(listing_prep[,input$box_colour]) }

  base <- ggplot(listing_prep, aes(x = x_b_cat, y = y_num)) + 
    labs(
      title = paste(input$chart_type, 'plot of ', input$x_b_cat, ' and ', input$y_b_num),
      x = paste(input$x_b_cat),
      y = paste(input$y_b_num),
      colour = paste(input$box_colour))
  
  add_box_c <- geom_boxplot(aes(fill = ccat), outlier.shape = NA)
  add_box <- geom_boxplot(outlier.shape = NA)
  add_vio <- geom_violin()
  add_vio_c <- geom_violin(aes(fill = ccat))
  
  bbox <- if (input$box_colour != 'None' & input$chart_type == 'Box'){base + add_box_c}
          else if(input$box_colour == 'None' & input$chart_type == 'Box'){ base + add_box }
          else if(input$box_colour != 'None' & input$chart_type == 'Violin'){ base + add_vio_c }
          else { base + add_vio}
  
  
  flip_chart <- if(input$flipxy){
     bbox + coord_flip()
   } else {
     bbox
   }  
  
  boxly <- ggplotly(flip_chart) %>% layout(boxmode = "group")
  
  boxly
})


bscols(widths = c(3,9),
       list(
        
        selectInput(inputId = 'x_b_cat',
          label = 'Select x-variable',
          choices = sort(colnames(listing_cat)),
          selected = 'review_scores_rating'),
        
        selectInput(inputId = 'y_b_num',
          label = 'Select y-variable',
          choices = sort(colnames(listing_num)),
          selected = 'price_per_pax'),
        
        selectInput(inputId = 'box_colour',
                   label = 'Colour chart by:',
                   choices = c('None',sort(colnames(listing_cat))),
                   selected = 'host_is_superhost'),
        
        selectInput(inputId = 'chart_type',
                    label = 'Select chart type:',
                    choices = c('Box', 'Violin'),
                    selected = 'box'),
        
        checkboxInput(inputId = 'flipxy',
              label = 'Flip axis',
              value = FALSE)
        
       ),
       plotlyOutput('bbox'))
```



## 6. Assessment of prototype

In deciding on the final prototype of our Shiny application, we assessed prototypes based on 3 main factors - interactivity, availability of statistical tests and compatibility with Shiny.

**i) Interactivity - `ggplot2` with `plotly`**

Given that the focus of our application is to be user friendly and interactive, `ggplot2` charts overlayed with `ggplotly()` triumphs over `ggstatsplot`. 

**ii) Statistical test - `ggstatsplot`**

`ggstatsplot` is an amazing package, one stop shop for visual plots and extensive statistical background. 

**iii) Compatability with Shiny - `ggplot2`**

`ggstatsplot` has some outstanding comparability issues with Shiny as raised in [Github](https://github.com/IndrajeetPatil/ggstatsplot/issues/475) as of the date of this report. Furthermore, during our prototype testing, we experienced some issues when attempting to sync shinywidgets to charts.

Meanwhile, `ggplot` syncs very well with Shiny. During our testing, we noticed that it is relatively easy and efficient to toggle between different chart types given that the base script, ie _ggplot(data, aes(x,y))_ is constant throughout all the charts required. While different functions are required for `ggstatsplot` i.e `gghistostat()` for histogram and `ggbarstats` for bar charts, toggle between charts is more challenging to script.

**v) Map - `leaflet`**

Although `tmap` fitted our requirements of being interactive and compatible with Shiny, however we found that `leaflet` was easier to script and customise. Nonetheless, this may just be our personal preference. (this assumes that we are able to rectify the chloropleth map issue)

**v) Other matters**

We also noticed that `ggstatsplot` automatically drops NAs, while `ggplot2` displays NA values if they are present in the dataset.
 
## 7. Conclusion 

Based on the above assessment, we found that `ggplot2` and `leaflet` suited our needs better at this juncture. 

Although `ggplot2` lacks the automation of statistical insights, it has an extensive list of charts available, is interactive with `ggplotly()` and, more importantly, compatible with R Shiny. The lack of statistical automation can be worked around by performing the statistical test at the server backend. 

## 8. Storyboard - design of the submodule 

The exploratory and confirmatory module will consist of 3 parts

1) Summary of variables using `skimr`,
2) Explore tab will consist of univariate, bivariate and confirmatory results using `ggplot2`, `ggplotly()` and statistical tests functions,
3) Point symbol and chloropleth map using `leaflet`.

See sketch below for submodule design:

![](images/sketch.jpg)

## 9. References

Zhou, Y., Leung, Sw., Mizutani, S. et al. (2020) MEPHAS: an interactive graphical user interface for medical and pharmaceutical statistical analysis with R and Shiny. *BMC Bioinformatics 21, 183*. <https://doi.org/10.1186/s12859-020-3494-x>

---

Infographic vector created by stories - www.freepik.com</a>
