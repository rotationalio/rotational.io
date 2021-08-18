---
title: "Une Histoire du Cloud et où il va ensuite"
slug: "cloud-generations"
date: 2021-07-02T15:32:47-04:00
draft: false
image_webp: images/media/2021-07-06-cloud-generations/cloudgeneration.webp
image: images/media/2021-07-06-cloud-generations/cloudgeneration.jpg
author: Edwin Schmierer
description: "Comment le cloud public a évolué et où il se dirige"
---

Il ne fait aucun doute que les fournisseurs de cloud public ont transformé le paysage technologique ; dans cet article, nous retraçons l'évolution du cloud pour recueillir des indices sur la direction suivante que prendra l’industrie.

## Encadrer les Générations de Cloud
Les fournisseurs de cloud tels qu'AWS et Google Cloud ont fourni une infrastructure critique, abaissé les barrières à l'entrée et établi une présence mondiale. Les organisations, grandes et petites, disposent d'une pléthore d'options lors de la création de leurs solutions technologiques. Mais une question que nous avons explorée est la suivante : quel est l'avenir des services cloud?

Chez Rotational, nous adoptons une perspective "générationnelle", en regardant vers le passé pour comprendre [comment l'industrie a évolué](https://en.wikipedia.org/wiki/Timeline_of_Amazon_Web_Services). Nous utilisons ce cadre pour émettre une hypothèse à quoi pourrait ressembler la prochaine génération de services cloud par rapport aux modèles que nous avons observés.

## Fondements
Alors que le terme "Cloud Computing" a été inventé pour la première fois au [milieu des années 1990](https://www.technologyreview.com/2011/10/31/257406/who-coined-cloud-computing/), la genèse de cloud remonte aux années [1960](https://en.wikipedia.org/wiki/Virtualization). De nombreuses technologies permettent le cloud, mais l'avancée technique fondamentale a été la [virtualisation](https://www.redhat.com/en/topics/virtualization/what-is-virtualization), qui permet de répartir les ressources d'une machine physique entre plusieurs utilisateurs ou environnements. La virtualisation a ouvert la porte à l'informatique à grande échelle, et la définition et les cas d'utilisation n'ont fait que s'élargir avec le temps. Le terme s'applique désormais de haut en bas dans les couches matérielles, serveur et système d'exploitation (OS).

### Première Génération
Nous définissons la première génération de services de cloud computing comme les entreprises qui ont appliqué la virtualisation pour louer leur capacité de serveur disponible. AWS a été lancé en 2006 avec les annonces d'Amazon Simple Storage Service (S3) et d'[Amazon Elastic Compute Cloud (EC2)](https://aws.amazon.com/about-aws/whats-new/2006/08/24/announcing-amazon-elastic-compute-cloud-amazon-ec2---beta/).

À l'époque, Amazon était en train de développer sa plate-forme de commerce électronique et de logistique et a reconnu deux points importants :

 1. un obstacle clé au développement de leurs propres applications était que [chaque équipe d'ingénieurs construisait ses propres ressources](https://techcrunch.com/2016/07/02/andy-jassys-brief-history-of-the-genesis-of-aws/) et ;
 2. ils disposaient d'une réserve de capacité de serveur à offrir aux développeurs à un coût relativement bas.

Grâce à ces services, les développeurs n'avaient plus besoin de mettre en place et de maintenir leurs propres serveurs et infrastructures de développement. L'infrastructure de base serait fournie par Amazon. En effet, les services matériels ont été dissociés et peuvent désormais être situés dans des centres de données distants.

### Deuxième Génération
Avec l'abstraction du matériel, les fournisseurs de services cloud ont commencé à monter en gamme sur le plan technologique. Sur la base de la demande des clients, les fournisseurs de services cloud ont commencé à proposer des services de données hôtes et de bases de données dans le cloud.

En 2009, AWS a lancé [Relational Database Service (RDS)](https://en.wikipedia.org/wiki/Amazon_Relational_Database_Service) suivi par DynamoDB en 2012. Dans le même temps, Microsoft, Google et d'autres ont commencé à proposer leurs propres services de cloud computing. Des solutions spécialisées telles que MongoDB, qui permet une mise à l'échelle horizontale des bases de données, [émergées](https://petedejoy.com/writing/mongodb), en s'appuyant largement sur le cloud et les logiciels libres.

Du point de vue du développeur, les services de matériel et de base de données peuvent désormais être abstraits.

### Troisième Génération
La troisième génération a été particulièrement énergique, car les fournisseurs de cloud ont continué à monter dans la hiérarchie.

Premièrement, nous avons assisté à l'émergence des services de données et de calcul dans le cloud. Les fournisseurs de cloud proposent désormais des services entièrement gérés pour les développeurs et les scientifiques des données afin de construire et d'héberger des modèles et des algorithmes d'apprentissage automatique. SageMaker d'Amazon en est un bon exemple.

Une autre dimension de cette génération est l'évolution vers la gestion d'applications complètes dans le cloud. Tandis que la [conteneurisation](https://blog.aquasec.com/a-brief-history-of-containers-from-1970s-chroot-to-docker-2016) et l'architecture des microservices ne sont généralement pas nouveaux, la possibilité de les gérer dans le cloud l'est. Les fournisseurs de cloud proposent désormais des outils d'orchestration tels que Kubernetes qui permettent le déploiement et la maintenance de processus et d'architectures complexes sur des clusters gérés.

Une autre dimension encore est celle des [architectures sans serveur](https://www.cloudflare.com/learning/serverless/what-is-serverless/), ce qui signifie fournir des services de calcul sans avoir besoin de serveurs dédiés. Ainsi, Les développeurs ont donc la possibilité de payer au fur et à mesure au lieu d'allouer des ressources dédiées. L'un des avantages présumés du sans serveur est la mise à l'échelle automatique. Amazon Lambda est un exemple.

Avec la troisième génération, les services cloud ont été soigneusement compartimentés en trois grands modèles "as-a-service" :

 - Infrastructure-as-a-Service (IAAS)
 - Platform-as-a-Service (PAAS)
 - Software-as-a-Service (SAAS)

## Modèles & Tensions Émergentes
Plusieurs modèles se dessinent.

La première est l'abstraction évidente des services dorsaux. Les systèmes dorsaux sous-jacents ont été abstraits, à un coût relativement faible pour les développeurs. Vous pouvez créer des systèmes qui connectent des collègues et des utilisateurs dans le monde entier sans avoir à vous soucier de l'endroit où les données sont stockées ou de la façon dont elles sont répliquées. Cependant, comme nous le verrons ci-dessous, il y a des compromis à faire, en particulier autour de la visibilité, de la transparence et de l'optimisation.

Parallèlement à l'abstraction, il y a une dépendance croissante à l'égard de quelques grands fournisseurs de cloud public qui ont construit une infrastructure pour leurs cas d'utilisation et se sont retournés pour l'offrir à d'autres. Non seulement le verrouillage du fournisseur est une préoccupation, il y a une certaine question quant à savoir si les infrastructures standardisées à taille unique sont réellement pertinentes ou rentables pour le consommateur de cloud quotidien.

Une autre tendance plus subtile est la centralisation croissante autour de grands centres de données, ce qui a des répercussions sur les performances et, de plus en plus, sur la conformité. Les systèmes juridiques et politiques commencent à rattraper leur retard. Si vous tirez parti d'une couche de stockage abstraite construite sur des centres de données centralisés, comment pouvez-vous être sûr de ne pas enfreindre le GDPR?

Enfin, et peut-être le plus subtil, est une perte de contexte dans le stockage des données et l'informatique, qui se traduit par une expérience moins qu'idéale pour les développeurs et les utilisateurs finaux. Si la géographie des données a été efficacement abstraite, serez-vous en mesure d'anticiper les événements de mise à l'échelle géographique?

## L'émergence de la quatrième génération?
Nous pensons que l'industrie est à l'aube d'une 4e génération. Bien que l'enthousiasme pour les données hébergées dans le cloud, le ML et les devops soit toujours élevé, nous nous dirigeons probablement vers une nouvelle saison caractérisée par une plus grande importance accordée aux économies du cloud (à l'instar du [Duckbill Group](https://www.duckbillgroup.com/services/cloud-finance-analysis/)) qu'au simple confort.

À mesure que l'adoption du cloud se développe, les développeurs et les organisations se posent des questions importantes. Nous entendons de plus en plus que le contexte et la géographie sont importants pour les utilisateurs, les développeurs, les infrastructures, les communautés et les gouvernements. L'informatique axée sur la sécurité et la confidentialité est également une priorité, car les pays commencent à affirmer la souveraineté des données. De plus en plus d'organisations recherchent des solutions multi-cloud ainsi que la colocation (par exemple [Amazon Outposts](https://aws.amazon.com/outposts/)). Plus d'applications sont conçues pour la périphérie, car chaque appareil est désormais un "centre de données". La prochaine génération de services cloud aura les mains pleines pour faire pour faire face à ce paysage technique changeant!

L'essentiel est que l'échelle compte toujours, mais ce n'est pas suffisant &mdash; car malgré l'abstraction et la centralisation, la complexité est seulement en train d'augmenter. Chez Rotational, nous pensons que la solution réside dans des systèmes qui évoluent à l'échelle mondiale et agissent localement, permettant aux développeurs et aux organisations d'évoluer de manière intelligente, réfléchie et respectueuse.
