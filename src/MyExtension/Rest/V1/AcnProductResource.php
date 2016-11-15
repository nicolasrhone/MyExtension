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
use Rubedo\Services\Manager;
use Rubedo\Collection\AbstractCollection;
use RubedoAPI\Entities\API\Definition\FilterDefinitionEntity;
use RubedoAPI\Exceptions\APIRequestException;
use RubedoAPI\Entities\API\Definition\VerbDefinitionEntity;
use WebTales\MongoFilters\Filter;
/**
 * Class TaxonomiesResource
 * @package RubedoAPI\Rest\V1
 */
class AcnproductResource extends AbstractResource
{
    /**
     * @var static
     */
    /**
     * Cache lifetime for api cache (only for get and getEntity)
     * @var int
     */
    public $cacheLifeTime=600;
    /**
     * { @inheritdoc }
     */
    public function __construct()
    {
        parent::__construct();
        $this->define();
    }
    
     /**
     * Get from /taxonomy
     *
     * @param $params
     * @return array
     */
    public function getAction($params)
    {
	
	$contentsService = Manager::getService('Contents');

        $codeBarre=$params['codeBarre'];
        $findFilter = Filter::Factory()->addFilter(Filter::factory('Value')->setName('isProduct')->setValue(true))
						->addFilter(Filter::factory('Value')->setName('productProperties.sku')->setValue($codeBarre));

        
        $content = $contentsService->findOne($findFilter,true,false);

        
        
        return [
            'success' => true,
            'content' => $content,
        ];
    }
 
    public function postAction($params)
    {
	$contentsService = Manager::getService('ContentsCcn');

        $codeBarre=$params['codeBarre'];
        $findFilter = Filter::Factory()->addFilter(Filter::factory('Value')->setName('isProduct')->setValue(true))
						->addFilter(Filter::factory('Value')->setName('productProperties.sku')->setValue($codeBarre));

        
        $content = $contentsService->findOne($findFilter,true,false);
	$content['productProperties']['variations'][0]['stock'] = $params['stock'];
        AbstractCollection::disableUserFilter(true);

        $result = $contentsService->update($content, array(),false);
        AbstractCollection::disableUserFilter(false);

        return [
            'success' => true,
            'content' => $content,
        ];
    }
   
    
    
    protected function define()
    {
        $this
            ->definition
            ->setName('Products ACN')
            ->setDescription('Link with Zachee - ACN')
            ->editVerb('get', function (VerbDefinitionEntity &$entity) {
                $this->defineGet($entity);
            })
            ->editVerb('post', function (VerbDefinitionEntity &$entity) {
                $this->definePost($entity);
            });

    }
    /**
     * Define get action
     *
     * @param VerbDefinitionEntity $definition
     */
    protected function defineGet(VerbDefinitionEntity &$entity)
    {
        $entity
            ->setDescription('Get produit de la boutique par code barre')
            ->addInputFilter(
		    (new FilterDefinitionEntity())
			->setKey('codeBarre')
			->setRequired()
			->setDescription('Code barre / sku')
		)
	    ->addOutputFilter(
		    (new FilterDefinitionEntity())
			->setKey('content')
			->setDescription('Produit de la boutique')
		);
    }
    
    protected function definePost(VerbDefinitionEntity &$entity)
    {
        $entity
	    ->setDescription('Patch product stock')
            ->addInputFilter(
                (new FilterDefinitionEntity())
                ->setDescription('Code barre / sku')
                ->setKey('codeBarre')
		->setRequired()
            )
	    ->addInputFilter(
                (new FilterDefinitionEntity())
                ->setDescription('Nouveau stock du produit')
                ->setKey('stock')
		->setFilter('int')
		->setRequired()
            )
            ->addOutputFilter(
                (new FilterDefinitionEntity())
                    ->setDescription('Nouvelle version du produit')
                    ->setKey('content')
                    ->setRequired()
            );
    }


}
