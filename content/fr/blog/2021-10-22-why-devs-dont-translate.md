---
title: "Pourquoi les Développeurs Ne Traduisent-ils Pas Les Documentations"
slug: "why-devs-dont-translate"
date: "2021-10-21T20:25:35-04:00"
draft: false
image_webp: images/blog/hubble_tarantula_nebula.webp
image: images/blog/hubble_tarantula_nebula.jpg
author: Rebecca Bilbro
description: "Les documentions de nombreux projets technologiques ne sont pas traduites, et ce, souvent au détriment de la couverture globale des utilisateurs. Dans cet article, nous examinons pourquoi."
---

Étoiles, fourches, mentions, avis positifs, téléchargements. Dans un monde où les utilisateurs régissent les règles, pourquoi les documentions des projets techniques ne sont-elles pas traduites pour toucher un plus grand nombre d'utilisateurs dans le monde ?
<!--more-->

Vous êtes-vous déjà demandé pourquoi la plupart des logiciels sont monolingues ? Pensez à la documentation, aux exemples, au code et à l'API de la pile de logiciels de votre choix. Il est fort probable qu'ils ne soient disponibles qu'en une seule langue (généralement l'anglais). Aussi incroyable que cela puisse paraître, il en va de même pour certains des projets les plus importants, les plus connus et les mieux financés. L'on croirait que rendre la technologie accessible aux locuteurs d'autres langues serait un moyen infaillible de gagner rapidement des utilisateurs et des parts de marché dans le monde entier, alors qu'en est-il ?

Chez Rotational, notre métier est de créer des applications distribuées à l'échelle mondiale. Les systèmes distribués sont composés de nombreux problèmes technologiques &mdash ; du hardware dans les datacenters aux algorithmes de consensus qui maintiennent et garantissent la cohérence. Mais si vous prévoyez d'avoir des utilisateurs, ce sont aussi des systèmes socioculturels, et un rendement élevé avec une forte cohérence n'a aucune importance si l'accessibilité linguistique constitue un goulot d'étranglement.

La vérité est que la traduction de documents est beaucoup, **beaucoup** plus difficile que vous ne le pensez. Dans cet article, nous allons nous pencher sur les 5 principales raisons qui empêchent les développeurs et les entreprises technologiques de prendre cette mesure apparemment simple et évidente :

## Raison N°1 - Nous pensons que l'anglais est une langue universelle
Pour couper court, la principale raison pour laquelle les développeurs ne traduisent pas leurs documentations est la croyance que l'anglais est universel. Effectivement, l'anglais est parlé d'une manière ou d'une autre par [de nombreuses personnes](https://www.statista.com/statistics/266808/the-most-spoken-languages-worldwide/) dans le monde entier :

> En 2021, environ 1,35 milliard de personnes dans le monde parlaient l'anglais, soit comme langue maternelle ou secondaire, soit un peu plus que les 1,12 milliard de personnes parlant le chinois mandarin au moment de l'enquête. L'hindi et l'espagnol se classaient en troisième et quatrième positions des langues les plus répandues cette année-là. - Szmigiera (2021)

Cela résulte peut-être du fait que l'histoire du développement de logiciels a été marquée jusqu'à présent par une croissance si fulgurante que nous croyons, à tort, qu'il y aura toujours plus d'utilisateurs à trouver. Cependant, la logique semble indiquer que cela ne pourra pas rester indéfiniment vrai, surtout si nous nous limitons aux anglophones. Avec une population mondiale de [près de 8 milliards de personnes](https://www.worldometers.info/world-population/), il y a beaucoup moins de personnes parlant anglais que de personnes ne parlant pas anglais.

De plus, proposer un logiciel dans un format uniquement en anglais présente le risque très réel non seulement *d’echec d’attraction* de nouveaux utilisateurs, mais aussi *d'aliéner* ces derniers. Dans un rapport de 2006 intitulé "Can't Read, Won't Buy : Why Language Matters" (Incapable d’acheter sans pouvoir lire : Pourquoi la langue est importante), DePalma et al. ont découvert qu'à moins que vous ne soyez déjà une marque internationale prospère, [l'utilisation de l'anglais uniquement comme moyen de vente aliénera les personnes](https://rotational.io/blog/cant-read-wont-buy/) dans d'autres pays qui ne parlent pas anglais ou qui ne l'utilisent pas comme langue principale.

## Raison N°2 - Nous pensons que la traduction machine a tout résolu
Une autre raison majeure pour laquelle les développeurs ne traduisent pas leurs documents est que nous pensons que la traduction est un problème "résolu" en matière d'intelligence artificielle. Cette prétention erronée a été alimentée par un flot d'articles sur l'efficacité de la TPG-3, l'omniprésence des outils de traduction automatique tels que Google Translate et les craintes concernant l'avènement de la Singularité.

La langue est complexe et nuancée, dotée de caractéristiques qui indexent les relativités linguistiques, les appartenances culturelles et les contextes extra-linguistiques qui sont pratiquement impossibles à coder et qui deviennent obsolètes. Il suffit de regarder les principales sociétés de logiciels de traduction, qui renforcent quasiment tous leurs modèles neuronaux préformés par des traducteurs humains experts. Vous ne me croyez toujours pas ? Jetez un coup d'œil à [Hamilton selon Google Translate](https://www.youtube.com/watch?v=thtKA71xZ7k).

[Les modèles linguistiques sont de plus en plus performants](https://rotational.io/blog/a-parrot-trainer-eats-crow/), mais nous n'en sommes pas encore là (mais peut-être un jour !).

## Raison N°3 - Nous pensons que les traducteurs coûtent cher et sont difficiles à trouver.
Eh bien, oui. Tout comme il est difficile de trouver un bon coiffeur, une bonne baby-sitter ou un bon mécanicien, il est difficile de trouver un traducteur en qui vous avez confiance et avec qui vous vous sentez bien.  Et vous pourriez avoir un sentiment de doute quant au montant que vous seriez prêt à dépenser pour faire traduire vos documents.

Les plateformes d'économie collaborative telles que Fiverr regorgent de traducteurs pour une panoplie de langues, mais la majorité d'entre eux ne proposent que des services de traduction de contexte général et non technique. Lorsque les étoiles et les avis obtenus sur la plateforme jouent un rôle important dans votre classement lors des recherches et, par conséquent, dans vos chances de trouver un emploi, il est judicieux de privilégier les articles d'actualité et les récits courts.

Le langage technique est difficile à traduire. Corollairement, les traducteurs techniques peuvent effectivement être plus difficiles à trouver et plus chers que leurs homologues généralistes. Mais que faire ? Chez Rotational, la traduction technique est un élément que nous avons appris à intégrer dans nos produits et nos budgets opérationnels.

## Raison N°4 - Les outils que nous utilisons rendent la tâche difficile
Il existe plusieurs façons de créer de la documentation technique, des générateurs de documents comme Sphinx et des services d'hébergement de documents comme Read the Docs ( les deux étant utilisés pour le projet open source d'apprentissage automatique [Yellowbrick](https://www.scikit-yb.org/en/develop/)), aux générateurs de sites statiques comme Jekyll et Hugo (nous utilisons Hugo pour la plupart de nos documents chez Rotational). Bien que ces outils réduisent la charge de la création de la documentation d'un projet, leur proposition de valeur est, pour la plupart, distincte de la prise en charge de l'internationalisation (i18n) ou de la localisation (l10n).

Si vous envisagez d'utiliser un générateur de site statique pour créer la documentation de votre projet, pensez à sélectionner [un modèle qui prendra en charge les documents multilingues](https://themes.gohugo.io/tags/multilingual/), même si vous n'êtes pas encore prêt à faire le grand saut avec la traduction. Gardez toutefois à l'esprit que la majorité de ces modèles ont été fournis par des créateurs individuels et qu'à ce titre, ils ne nous doivent que peu de garanties ; vous découvrirez peut-être que certains textes du site sont codés en dur en anglais, ou que les alphabets à base de caractères et les scripts cyrilliques sont moins bien pris en charge.

Dans notre quête d'internationalisation et de localisation de notre documentation pour le [Global Directory Service](https://vaspdirectory.net/) (un système d'enregistrement sécurisé entre pairs pour les transactions internationales légales en crypto-monnaies), l'une des découvertes les plus surprenantes réalisées par Rotational est qu'il n'existe pas de véritable norme internationale pour Markdown. Malheureusement, cela signifie que certains éditeurs de texte semblent mélanger les codages de caractères et les signes de ponctuation occidentaux tels que les crochets et les parenthèses, sur lesquels le Markdown s'appuie pour un meilleur rendu.

## Raison N°5 - Nous craignons d'actualiser la documentation traduite
La mise à jour de la documentation est un point sensible dans le monde de la technologie ; c'est une tâche dont nous nous plaignons tous d'avoir à nous acquitter, mais dont nous nous plaignons également lorsque nous, utilisateurs, ne trouvons pas la documentation de la dernière version.

Il n'y a pas de doute à ce sujet &mdash ; Maintenir de multiples traductions des documents à jour représente une charge importante en plus d'une tâche déjà détestée.

Par-dessus tout, il y a la question de l'analyse de la qualité linguistique (AQL), qui met en évidence la difficulté de réviser et de maintenir une documentation que l'on ne comprend pas et dont on ne peut donc pas systématiquement évaluer la qualité ou l'ancienneté.

## Conclusion
En 2019, l'un des contributeurs au projet Yellowbrick, Juan Kehoe, a traduit une partie de notre documentation en mandarin. Bien que sa traduction ait été partielle et que nous ayons eu du mal à la maintenir à jour, nous entendons régulièrement des [développeurs en Chine](https://cloud.tencent.com/developer/news/238057) dire qu'ils ont choisi d'apprendre Yellowbrick parce qu'il avait une documentation de soutien en chinois. Cela a changé la donne pour nous.

En d'autres termes, si cet article dresse un portrait quelque peu sombre des défis auxquels vous serez confrontés lorsque vous vous efforcerez de traduire votre documentation technique en d'autres langues, ne vous laissez pas abattre. D'après notre expérience, le plus difficile est de commencer, car même de petits pas peuvent couvrir beaucoup de terrain.

Et, si vous êtes comme nous, vous lirez dans ces désagréments, un avenir meilleur, un avenir rempli d'outils encore meilleurs conçus pour résoudre le problème de rendre les logiciels plus accessibles au-delà des frontières linguistiques et culturelles et de se connecter avec les utilisateurs du monde entier.

Avez-vous un projet qui privilégie l'i18n et l10n ? Travaillez-vous sur une norme internationale Markdown/Markup ? Êtes-vous à l'affût de la prochaine génération d'outils de couverture linguistique ? Si tel est le cas, nous voulons en savoir plus!

***

[Photo](https://flic.kr/p/Yaz1mM) par Judy Schmidt sur Flickr, CC By 2.0
