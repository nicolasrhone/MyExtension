<?php
return array(
    'paymentMeans' => array(
        'paybox' => array(
            'name' => "PayBox ACN",
            'service' => 'PayboxPayment',
            'definitionFile' => realpath(__DIR__ . "/paymentMeans/") . '/paybox.json'
        ),
								/*NEW CONFIGS*/
								'int' => array(
            'name' => "International",
            'definitionFile' => realpath(__DIR__ . "/paymentMeans/") . '/siteConfig.json'
        ),
								'france' => array(
            'name' => "France",
            'definitionFile' => realpath(__DIR__ . "/paymentMeans/") . '/siteConfig.json'
        ),
								'pologne' => array(
            'name' => "Pologne",
            'definitionFile' => realpath(__DIR__ . "/paymentMeans/") . '/siteConfig.json'
        ),
								'italie' => array(
            'name' => "Italie",
            'definitionFile' => realpath(__DIR__ . "/paymentMeans/") . '/siteConfig.json'
        ),
								'espagne' => array(
            'name' => "Espagne",
            'definitionFile' => realpath(__DIR__ . "/paymentMeans/") . '/siteConfig.json'
        ),
								'liban' => array(
            'name' => "Liban",
            'definitionFile' => realpath(__DIR__ . "/paymentMeans/") . '/siteConfig.json'
        ),
								'israel' => array(
            'name' => "Israël",
            'definitionFile' => realpath(__DIR__ . "/paymentMeans/") . '/siteConfig.json'
        ),
								'belgique' => array(
            'name' => "Belgique",
            'definitionFile' => realpath(__DIR__ . "/paymentMeans/") . '/siteConfig.json'
        ),
								'martinique' => array(
            'name' => "Martinique",
            'definitionFile' => realpath(__DIR__ . "/paymentMeans/") . '/siteConfig.json'
        ),
									'canada' => array(
            'name' => "Canada",
            'definitionFile' => realpath(__DIR__ . "/paymentMeans/") . '/siteConfig.json'
        ),
								'hongrie' => array(
            'name' => "Hongrie",
            'definitionFile' => realpath(__DIR__ . "/paymentMeans/") . '/siteConfig.json'
        ),
								'uk' => array(
            'name' => "Royaume-Uni",
            'definitionFile' => realpath(__DIR__ . "/paymentMeans/") . '/siteConfig.json'
        ),
								'bresil' => array(
            'name' => "Brésil",
            'definitionFile' => realpath(__DIR__ . "/paymentMeans/") . '/siteConfig.json'
        )
         
    ),
    

    /**
     * Your block definition : back-office json configuration file
     */    
    'blocksDefinition' => array(
       'buttonToPage' => array(
            'maxlifeTime' => 60,
            'definitionFile' => realpath(__DIR__ . "/blocks/") . '/buttonToPage.json'
        ),
        'carrousel' => array(
            'maxlifeTime' => 60,
            'definitionFile' => realpath(__DIR__ . "/blocks/") . '/carrousel.json'
        ),
        'category' => array(
            'maxlifeTime' => 60,
            'definitionFile' =>  realpath(__DIR__ . "/blocks/") . '/category.json'
        ),  
       'contactBlock' => array(
            'maxlifeTime' => 60,
            'definitionFile' => realpath(__DIR__ . "/blocks/") . '/contactBlock.json'
        ),
       'contentList' => array(
            'maxlifeTime' => 60,
            'definitionFile' => realpath(__DIR__ . "/blocks/") . '/contentList.json'
        ),
       'contentDetail' => array(
            'maxlifeTime' => 60,
            'definitionFile' => realpath(__DIR__ . "/blocks/") . '/contentDetail.json'
        ),
       'facebook' => array(
            'maxlifeTime' => 60,
            'definitionFile' => realpath(__DIR__ . "/blocks/") . '/facebook.json'
        ),
							 'form' => array(
            'maxlifeTime' => -1,
            'definitionFile' => realpath(__DIR__ . "/blocks/") . '/survey_form.json'
        ),
       'simpleContact' => array(
            'maxlifeTime' => 60,
            'definitionFile' => realpath(__DIR__ . "/blocks/") . '/simpleContact.json'
        ),
        'searchResults' => array(
            'maxlifeTime' => 60,
            'definitionFile' => realpath(__DIR__ . "/blocks/") . '/searchResults.json'
        ),
								'searchDons' => array(
            'maxlifeTime' => 60,
            'definitionFile' => realpath(__DIR__ . "/blocks/") . '/searchDons.json'
        ),
        'productList' => array(
            'maxlifeTime' => 60,
            'definitionFile' => realpath(__DIR__ . "/blocks/") . '/productList.json'
        ),
         'calendar' => array(
            'maxlifeTime' => 60,
            'definitionFile' => realpath(__DIR__ . "/blocks/") . '/calendar.json'
        ),
         'richText' => array(
            'maxlifeTime' => 60,
            'definitionFile' => realpath(__DIR__ . "/blocks/") . '/richText.json'
        ),
        'geoSearchResults' => array(
               'maxlifeTime' => 60,
               'definitionFile' => realpath(__DIR__ . "/blocks/")  . '/geoSearchResults.json'
           ),
        'navigation' => array(
            'maxlifeTime' => 60,
            'definitionFile' => realpath(__DIR__ . "/blocks/") . '/navigation.json'
        ),
        'bg_image' => array(
               'maxlifeTime' => 60,
               'definitionFile' => realpath(__DIR__ . "/blocks/")  . '/bg_image.json'
           ),
        'sectionPresentation' => array(
            'maxlifeTime' => 60,
            'definitionFile' => realpath(__DIR__ . "/blocks/") . '/sectionPresentation.json'
        ),
        'carrousel2' => array(
            'maxlifeTime' => 60,
            'definitionFile' => realpath(__DIR__ . "/blocks/") . '/carrousel2.json'
        ),
        'redirect' => array(
            'maxlifeTime' => 60,
            'definitionFile' => realpath(__DIR__ . "/blocks/") . '/redirect.json'
        ),
        'recommendedContents' => array(
            'maxlifeTime' => 60,
            'definitionFile' =>  realpath(__DIR__ . "/blocks/")  . '/recommendedContents.json'
        ),
        'siteMap' => array(
            'maxlifeTime' => 60,
            'definitionFile' => realpath(__DIR__ . "/blocks/") . '/siteMap.json'
        ),
        'imageBatchUpload' => array(
            'maxlifeTime' => 60,
            'definitionFile' => realpath(__DIR__ . "/blocks/") . '/imageBatchUpload.json'
        ),
        'ordersList' => array(
            'maxlifeTime' => 60,
            'definitionFile' => realpath(__DIR__ . "/blocks/") . '/ordersList.json'
        ),
        'logoMission' => array(
            'maxlifeTime' => 60,
            'definitionFile' => realpath(__DIR__ . "/blocks/") . '/logoMission.json'
        ),
				),

    'templates' => array(
        'themes' => array(
            'cte' => array(
                'label' => 'CTE',
                'basePath' => realpath(__DIR__ . '/../theme/cte'),
                'css' => array(
                    '/css/cte.css',
                    '/css/font-awesome.css',
                    '/css/cheminneuf.css'
                ),
                'js' => array(
                    '/js/cte.js',
                    '../js/lazy-image.js',
                    '../js/blocks.js',
                ),
                'angularModules' => array(
                    'ngFileUpload' => '/lib/ngFileUpload.js'
                ),
            ),
            'wtp15' => array(
                'label' => 'WTP15',
                'basePath' => realpath(__DIR__ . '/../theme/wtp15'),
                'css' => array(
                    '/css/wtp2015.css',
                    '/css/ru.css'
                ),
                'js' => array(
                    '/js/wtp.js',
                ),
            ),
             'wtp17' => array(
                'label' => 'WTP17',
                'basePath' => realpath(__DIR__ . '/../theme/wtp17'),
                'css' => array(
                    '/css/wtp2015.css',
                    '/css/ru.css'
                ),
                'js' => array(
                    '/js/wtp.js',
                     '../js/lazy-image.js',
                ),
                'angularModules' => array(
                    'angularVideoBg' => '/lib/angular-video-bg.min.js',
																				'ngFileUpload' => '/lib/ngFileUpload.js'
                ),
            ),
            'jmj2016' => array(
                'label' => 'JMJ2016',
                'basePath' => realpath(__DIR__ . '/../theme/jmj2016'),
                'css' => array(
                    '/css/jmj2016.css',
                ),
                'js' => array(
                    '/js/jmj.js',
                    '../js/lazy-image.js',
                ),
            ),
            'netforgod' => array(
                'label' => 'Net4God',
                'basePath' => realpath(__DIR__ . '/../theme/netforgod'),
                'css' => array(
                    '/css/netforgod.css',
                    'css/font-nfg.css'
                ),
                'js' => array(
                    '/js/netforgod.js',
                ),
            ),
            'musculine' => array(
                'label' => 'Musculine',
                'basePath' => realpath(__DIR__ . '/../theme/musculine'),
                'css' => array(
                    '/css/musculine.css'
                ),
                'js' => array(
                    '/js/musculine.js',
                ),
            ),
            'worshipteam' => array(
                'label' => 'Worship Team',
                'basePath' => realpath(__DIR__ . '/../theme/worshipteam'),
                'css' => array(
                    '/css/worship.css',
                    '/css/font-awesome.css'
                ),
                'js' => array(
                    '/js/worship.js'
                ),
            ),
            'goodnews' => array(
                'label' => 'Good News',
                'basePath' => realpath(__DIR__ . '/../theme/goodnews'),
                'css' => array(
                    '/css/goodnews.css',
                    '/css/font-awesome.css'
                ),
                'js' => array(
                    '/js/goodnews.js'
                ),
            ),
           'boutique' => array(
                'label' => 'Boutique',
                'basePath' => realpath(__DIR__ . '/../theme/boutique'),
                'css' => array(
                    '/css/boutique.css',
                    '/css/font-awesome.css'
                ),  
                'js' => array(
                     '../js/lazy-image.js',
                    '/js/boutique.js'
                ),
                'angularModules' => array(
                    'ngFileUpload' => '/lib/ngFileUpload.js'
                ),
           ),
           'cana' => array(
                'label' => 'Cana',
                'basePath' => realpath(__DIR__ . '/../theme/cana'),
                'css' => array(
                    '/css/cana.css',
                    '/css/font-awesome.css'
                ),
                'js' => array(
                    '../js/lazy-image.js',
                    '/js/cana.js'
                ),
                'angularModules' => array(
                    'ngFileUpload' => '/lib/ngFileUpload.js'
                ),
           ),
        ),
    ),
    
    'namespaces_api' => array(
        'MyExtension',
    ),
    
        /*
      Surcharge de la vue index du front
     */
    'view_manager' => array(
        'template_map' => array(
            'layout/layout' => realpath(__DIR__) . '/../views/layout/layout.phtml',
            'error/404' =>  realpath(__DIR__) . '/../views/error/404.phtml',
            'rubedo/index/index' => realpath(__DIR__) . '/../views/index/index.phtml'
        ),
    ),
    /*ajout du service Paybox*/
    'service_manager' => array(
        'invokables' => array(
            'PayboxPayment'=>'Rubedo\\Payment\\PayboxPayment',
            //'PaypalPayment'=>'Rubedo\\Payment\\CcnPaypalPayment',
            'ContentsCcn' => 'Rubedo\\Collection\\ContentsCcn',
            'HtmlCleaner' => 'Rubedo\\Security\\CcnHtmlPurifier',
            'ShippersCcn' => 'Rubedo\\Collection\\ShippersCcn',
           'MongoDataImport' => 'Rubedo\\Mongo\\DataImportCcn',
            'SitesConfigCcn' => 'Rubedo\\Collection\\SitesConfigCcn',
												'Forms' => 'MyExtension\\Service\\Forms',
            'FormsResponses' => 'MyExtension\\Service\\FormsResponses'
        )
    ),
    'controllers' => array(
        'invokables' => array(
            'Rubedo\\Backoffice\\Controller\\Contents' => 'Rubedo\\Backoffice\\Controller\\CcnContentsController',
												'MyExtension\\Backoffice\\Controller\\Forms' => 'MyExtension\\Backoffice\\Controller\\FormsController'
        )
    ),
				'router' => array(
        'routes' => array(
            // Backoffice route : prefix by backoffice
            'surveyBackOffice' => array(
                'type' => 'Literal',
                'options' => array(
                    'route' => '/backoffice/forms',
                    'defaults' => array(
                        '__NAMESPACE__' => 'MyExtension\\Backoffice\\Controller',
                        'controller' => 'forms',
                        'action' => 'index'
                    )
                ),
                'may_terminate' => true,
                'child_routes' => array(
                    'default' => array(
                        'type' => 'Segment',
                        'options' => array(
                            'route' => '/[:action]',
                            '__NAMESPACE__' => 'MyExtension\\Backoffice\\Controller',
                            'constraints' => array(
                                'controller' => 'forms',
                                'action' => '[a-zA-Z][a-zA-Z0-9_-]*'
                            ),
                            'defaults' => array()
                        )
                    )
                )
            )
        )
    ),
				'appExtension' => array(
        'survey' => array(
            'basePath' => realpath(__DIR__ . '/../app-extension') . '/survey',
            'definitionFile' => realpath(__DIR__ . '/../app-extension') . '/survey.json'
        )
    ),
    /* Surcharge des traductions
       */
    'localisationfiles' => array(
        'extensions/nicolasrhone/myextension/localization/languagekey/Blocks/ButtonToPage.json',
         'extensions/nicolasrhone/myextension/localization/languagekey/Blocks/GeneralFields.json',
         'extensions/nicolasrhone/myextension/localization/languagekey/Blocks/Share.json',
         'extensions/nicolasrhone/myextension/localization/languagekey/Blocks/Emails.json',
									'extensions/nicolasrhone/myextension/localization/languagekey/Survey/survey.json'
    ),
				'extension_paths' => array(
        'survey' => array(
            'path' => realpath(__DIR__ . '/../block/survey'),
            'css' => array(),
            'js' => array('js/survey.js'),
        ),
    ),
   
);
