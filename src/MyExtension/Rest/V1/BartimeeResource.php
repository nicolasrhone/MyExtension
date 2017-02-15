<?php
/**
 * Rubedo -- ECM solution
 * Copyright (c) 2014, WebTales (http://www.webtales.fr/).
 * All rights reserved.
 * licensing@webtales.fr
 *
 * Open Source License
 * ------------------------------------------------------------------------------------------
 * Rubedo is licensed under the terms of the Open Source GPL 3.0 license.
 *
 * @category   Rubedo
 * @package    Rubedo
 * @copyright  Copyright (c) 2012-2014 WebTales (http://www.webtales.fr)
 * @license    http://www.gnu.org/licenses/gpl.html Open Source GPL 3.0 license
 */
namespace RubedoAPI\Rest\V1;
use RubedoAPI\Entities\API\Definition\FilterDefinitionEntity;
use RubedoAPI\Entities\API\Definition\VerbDefinitionEntity;
use Zend\Json\Json;
/**
 * Class SearchResource
 * @package RubedoAPI\Rest\V1
 */
class BartimeeResource extends AbstractResource
{
    /**
     * @var string
     */
    protected $searchOption;
    /**
     * @var array
     */
    protected $searchParamsArray;
    /**
     * {@inheritdoc}
     */
    public function __construct()
    {
        parent::__construct();
        $this->searchOption = 'content';
        $this->searchParamsArray = array('orderby', 'orderbyDirection', 'query', 'objectType', 'type', 'damType', 'userType', 'author',
            'userName', 'lastupdatetime', 'start', 'limit', 'searchMode','price','inStock',"isMagic","fingerprint","historyDepth","historySize","useDetailContent","detailContentId");
        $this
            ->definition
            ->setName('Search')
            ->setDescription('Search Donations with ElasticSearch')
            ->editVerb('get', function (VerbDefinitionEntity &$entity) {
                $entity
                    ->setDescription('Get a list of media using Elastic Search')
                    ->addOutputFilter(
                        (new FilterDefinitionEntity())
                            ->setKey('results')
                            ->setDescription('List of result return by the research')
                    )
                    ->addOutputFilter(
                        (new FilterDefinitionEntity())
                            ->setKey('count')
                            ->setDescription('Number of results return by the research')
                    );
            });
    }
    /**
     * Get action
     * @param $queryParams
     * @return array
     */
    public function getAction($queryParams)
    {
        $queryParams["type"] = ["5652dcb945205e0d726d6caf"];
        $queryParams["searchMode"] = "default";
        $params = $this->initParams($queryParams);
        $query = $this->getElasticDataSearchService();
        $query::setIsFrontEnd(true);
        $query->init();
        $results = $query->search($params, $this->searchOption);
        $this->injectDataInResults($results, $queryParams);
        return [
            'success' => true,
            'results' => $results,
            'count' => $results['total']
        ];
    }
    /**
     * init params
     *
     * @param $queryParams
     * @return array
     */
    protected function initParams($queryParams)
    {
        $blockConfigArray = array('displayMode', 'displayedFacets');
        $params = array(
            'limit' => 25,
            'start' => 0
        );
        foreach ($queryParams as $keyQueryParams => $param) {
            if ($keyQueryParams == 'constrainToSite' && $param && isset($queryParams['siteId'])) {
                $params['navigation'][] = (string)$queryParams['siteId'];
            } else if ($keyQueryParams == 'predefinedFacets') {
                $this->parsePrefedinedFacets($params, $queryParams);
            } else if (in_array($keyQueryParams, $blockConfigArray)) {
                $params['block-config'][$keyQueryParams] = $param;
            } else if (in_array($keyQueryParams, $this->searchParamsArray)) {
                $params[$keyQueryParams] = $param;
            } else if ($keyQueryParams == 'taxonomies') {
                $taxonomies = JSON::decode($param);
                foreach ($taxonomies as $taxonomy => $verbs) {
                    $params[$taxonomy] = $verbs;
                }
            }
        }
        return $params;
    }
    /**
     * Parse predefined facets
     *
     * @param $params
     * @param $queryParams
     */
    protected function parsePrefedinedFacets(&$params, $queryParams)
    {
        $predefParamsArray = Json::decode($queryParams['predefinedFacets'], Json::TYPE_ARRAY);
        if (is_array($predefParamsArray)) {
            if (isset($predefParamsArray['query']) && isset($queryParams['query']) && $predefParamsArray['query'] != $queryParams['query']) {
                $inter = $predefParamsArray['query'] . ' ' . $queryParams['query'];
                $predefParamsArray['query'] = $inter;
                $queryParams['query'] = $inter;
            }
            foreach ($predefParamsArray as $key => $value) {
                $params[$key] = $value;
            }
        }
    }
    /**
     * Inject data in results
     *
     * @param $results
     * @param $params
     */
    protected function injectDataInResults(&$results, $params)
    {
        if (isset($params['profilePageId'])) {
            $urlOptions = array(
                'encode' => true,
                'reset' => true,
            );
            $profilePageUrl = $this->getContext()->url()->fromRoute('rewrite', array(
                'pageId' => $params['profilePageId'],
                'locale' => $params['lang']->getLocale(),
            ), $urlOptions);
        }
        if (isset($params['pageId'],$params['siteId'])){
            $page = $this->getPagesCollection()->findById($params['pageId']);
            $site = $this->getSitesCollection()->findById($params['siteId']);
        }
        foreach ($results['data'] as $key => $value) {
            switch ($value['objectType']) {
                case 'dam':
                    $results['data'][$key]['url'] = $this->getUrlAPIService()->mediaUrl($results['data'][$key]['id']);
                    if (isset($results['data'][$key]['author'])) {
                        $results['data'][$key]['authorUrl'] = isset($profilePageUrl) ? $profilePageUrl . '?userprofile=' . $results['data'][$key]['id'] : '';
                    }
                    break;
                case 'content':
                    if (isset($params['pageId'],$params['siteId'])) {
                        $results['data'][$key]['url'] = $this->getUrlAPIService()->displayUrlApi($results['data'][$key], 'default', $site,
                            $page, $params['lang']->getLocale(), isset($params['detailPageId']) ? (string)$params['detailPageId'] : null);
                    }
                    if (isset($results['data'][$key]['author'])) {
                        $results['data'][$key]['authorUrl'] = isset($profilePageUrl) ? $profilePageUrl . '?userprofile=' . $results['data'][$key]['id'] : '';
                    }
                    break;
                case 'user':
                    $results['data'][$key]['url'] = isset($profilePageUrl) ? $profilePageUrl . '?userprofile=' . $results['data'][$key]['id'] : '';
                    $results['data'][$key]['avatar'] =
                        $this->getUrlAPIService()->userAvatar($results['data'][$key]['id'], 100, 100, 'boxed') == ' ' ?
                            false : $this->getUrlAPIService()->userAvatar($results['data'][$key]['id'], 100, 100, 'boxed');
            }
        }
        if (isset($params['displayedFacets'])) {
            $this->injectOperatorsInActiveFacets($results, $params);
        }
    }
    /**
     * inject operators in active facets
     *
     * @param $results
     * @param $params
     */
    protected function injectOperatorsInActiveFacets(&$results, $params)
    {
        if ($params['displayedFacets'] == "['all']") {
            $taxonomyService = $this->getTaxonomyCollection();
            foreach ($results['activeFacets'] as $key => $activeFacet) {
                if (in_array($activeFacet['id'], $this->searchParamsArray)) {
                    $results['activeFacets'][$key]['operator'] = 'and';
                } else {
                    //Todo regex MongoId
                    try {
                        $taxonomy = $taxonomyService->findById($activeFacet['id']);
                        $results['activeFacets'][$key]['operator'] = isset($taxonomy['facetOperator']) ? strtolower(
                            $taxonomy['facetOperator']) : 'and';
                    } catch (\Exception $e) {
                        $results['activeFacets'][$key]['operator'] = 'and';
                    }
                }
            }
        } else {
            $displayedFacets = Json::decode($params['displayedFacets'], Json::TYPE_ARRAY);
            $operatorByActiveFacet = array();
            foreach ($displayedFacets as $displayedFacet) {
                $operatorByActiveFacet[$displayedFacet['name']] = strtolower($displayedFacet['operator']);
            }
            foreach ($results['activeFacets'] as $key => $activeFacet) {
                if ($activeFacet['id'] == 'query' || !isset($operatorByActiveFacet[$activeFacet['id']])) {
                    $results['activeFacets'][$key]['operator'] = 'and';
                } else {
                    $results['activeFacets'][$key]['operator'] = $operatorByActiveFacet[$activeFacet['id']];
                }
            }
        }
    }
}