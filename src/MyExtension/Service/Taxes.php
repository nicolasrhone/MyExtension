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
namespace Rubedo\Collection;
use Rubedo\Interfaces\Collection\ITaxes;
use WebTales\MongoFilters\Filter;
/**
 * Service to handle Taxes
 *
 * @author adobre
 * @category Rubedo
 * @package Rubedo
 */
class TaxesCcn extends AbstractCollection implements ITaxes
{
    public function __construct()
    {
        $this->_collectionName = 'Taxes';
        parent::__construct();
    }
    /**
     * @see \Rubedo\Interfaces\Collection\ITaxes::getTaxValue
     */
    public function getTaxValue($productTypeId, $userTypeId, $country, $region, $postalCode, $basePrice)
    {
        $filters = Filter::factory()->addFilter(Filter::factory('Value')->setName('active')->setValue(true))
            ->addFilter(Filter::factory('In')->setName('productTypes')->setValue([$productTypeId, '*']))
            ->addFilter(Filter::factory('In')->setName('userTypes')->setValue([$userTypeId, '*']))
            ->addFilter(Filter::factory('In')->setName('country')->setValue([$country, '*']))
            ->addFilter(Filter::factory('In')->setName('region')->setValue([$region, '*']))
            ->addFilter(Filter::factory('In')->setName('postalCode')->setValue([$postalCode, '*']));
        $sort = array();
        $sort[] = array(
            'property' => 'priority',
            'direction' => 'ASC'
        );
        $applicableTaxes = $this->getList($filters, $sort);
        $endPrice = $basePrice;
        $currentPriority = 0;
        $currentRate = 0;
        foreach ($applicableTaxes['data'] as $value) {
            if ($value['priority'] > $currentPriority) {
                //$endPrice = $endPrice + ($endPrice * ($currentRate / 100));
                $currentRate = 0;
            }
            $currentPriority = $value['priority'];
            $currentRate = $currentRate + $value['rate'];
        }
        $endPrice = round($endPrice + ($endPrice * ($currentRate / 100)), 2);
        return ($endPrice);
    }
}