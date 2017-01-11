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

namespace RubedoAPI\Rest\V1\Ecommerce;

use Rubedo\Services\Manager;
use RubedoAPI\Entities\API\Definition\FilterDefinitionEntity;
use RubedoAPI\Entities\API\Definition\VerbDefinitionEntity;
use RubedoAPI\Exceptions\APIEntityException;
use RubedoAPI\Rest\V1\AbstractResource;

/**
 * Class ShippersResource
 * @package RubedoAPI\Rest\V1\Ecommerce
 */
class ShippersResource extends AbstractResource
{
    /**
     * { @inheritdoc }
     */
    public function __construct()
    {
        parent::__construct();
        $this
            ->definition
            ->setName('Shippers')
            ->setDescription('Deal with Shippers')
            ->editVerb('get', function (VerbDefinitionEntity &$entity) {
                $entity
                    ->setDescription('Get a page and all blocks')
                    ->editInputFilter('access_token', function (FilterDefinitionEntity &$filter) {
                        $filter
                            ->setRequired();
                    })
                    ->addInputFilter(
                        (new FilterDefinitionEntity())
                            ->setDescription('Shopping cart token')
                            ->setKey('shoppingCartToken')
                    )
                    ->addOutputFilter(
                        (new FilterDefinitionEntity())
                            ->setDescription('Shippers')
                            ->setKey('shippers')
                            ->setRequired()
                    )
                    ->addOutputFilter(
                        (new FilterDefinitionEntity())
                            ->setDescription('Shippers')
                            ->setKey('cart')
                            ->setRequired()
                    );
            });
    }

    /**
     * Get to ecommerce/shippers
     *
     * @param $params
     * @throws \RubedoAPI\Exceptions\APIEntityException
     * @return array
     */
    public function getAction($params)
    {
        $user = $params['identity']->getUser();
        if (!isset($user['shippingAddress']) || !isset($user['shippingAddress']['country']))
            throw new APIEntityException('User\'s country is mandatory');

        $items = 0;
        $token=isset($params['shoppingCartToken']) ? $params['shoppingCartToken'] : null;
        $myCart = $shoppingCart = $this->getShoppingCartCollection()->getCurrentCart($token);

        //foreach ($myCart as $value) {
          //  $items = $items + $value['amount'];
            //var_dump($value['productId']);
            //var_dump($value['variationId']);
        //}

        $myShippers = Manager::getService("ShippersCcn")->getApplicableShippers($user['shippingAddress']['country'], $myCart);
        if (empty($myShippers))
            throw new APIEntityException('No shippers', 404);

        return array(
            'success' => true,
            'shippers' => $myShippers["data"],
            'cart' => $myCart,
        );
    }
}
