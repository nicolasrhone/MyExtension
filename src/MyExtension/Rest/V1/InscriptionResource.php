<?php
namespace RubedoAPI\Rest\V1;

use RubedoAPI\Rest\V1\AbstractResource;
use Rubedo\Services\Manager;
use RubedoAPI\Entities\API\Definition\FilterDefinitionEntity;
use RubedoAPI\Entities\API\Definition\VerbDefinitionEntity;
use WebTales\MongoFilters\Filter;
class InscriptionResource extends AbstractResource
{
    /**
     * native config for this payment means
     *
     * @var array
     */
    public function __construct()
    {
        parent::__construct();
        $this
            ->definition
            ->setName('Inscription')
            ->setDescription('Service d\'inscription')
            ->editVerb('post', function (VerbDefinitionEntity &$verbDefinitionEntity) {
                $verbDefinitionEntity
                    ->setDescription('Get résultats du formulaire d\'inscription')
                    ->addInputFilter(
                        (new FilterDefinitionEntity())
                            ->setDescription('Inscription')
                            ->setKey('inscription')                            
                    )
                     ->addInputFilter(
                        (new FilterDefinitionEntity())
                            ->setKey('workspace')
                            ->setRequired()
                            ->setDescription('Workspace')
                    )
                    ->addOutputFilter(
                        (new FilterDefinitionEntity())
                            ->setDescription('Résultat de l\'inscription')
                            ->setKey('result')
                    );
            });
    }
    public function postAction($params)
    {
        $id = "5625176445205e6b03832548"; // id du contenu "Numéro d'inscription"
        $language = preg_replace('%^/(\w+?)/.*$%', '$1', $_SERVER["REQUEST_URI"]);
        //authentication
        $auth = $this->getAuthAPIService()->APIAuth('admin_inscriptions', '2qs5F7jHf8KD');
        $output['token'] = $this->subTokenFilter($auth['token']);
        $token = $output['token']['access_token'];
        //GET NUMERO D'INSCRIPTION ACTUEL
        $inscription = $this->getContentsCollection()->findById($id, true, false);
        $inscriptionNumber = (int)$inscription['fields']['value'] +1;
        
        $inscription['fields']['value'] = (string)$inscriptionNumber;
        
        //UPDATE NUMERO D'INSCRIPTION
        $payload = json_encode( array( "content" => $inscription ) );
        $curl = curl_init();
        // Set some options - we are passing in a useragent too here
        curl_setopt_array($curl, array(
            CURLOPT_RETURNTRANSFER => 1,
            CURLOPT_URL =>'http://' . $_SERVER['HTTP_HOST'] . '/api/v1/contents/'.$id.'?access_token='.$token.'&lang=fr'
        ));
        curl_setopt($curly, CURLOPT_FOLLOWLOCATION, true);  // Follow the redirects (needed for mod_rewrite)
        curl_setopt($curly, CURLOPT_FRESH_CONNECT, true);   // Always ensure the connection is fresh
        curl_setopt( $curl, CURLOPT_HTTPHEADER, array('Content-Type:application/json'));
        curl_setopt($curl, CURLOPT_CUSTOMREQUEST, 'PATCH');
        curl_setopt($curl, CURLOPT_POSTFIELDS, $payload);
        curl_setopt($curl, CURLOPT_ENCODING, 'windows-1252');
        $result = curl_exec($curl);
    // Close request to clear up some resources
        curl_close($curl);
        
        
        
        
        
        
        
        
        return array('success' => true, 'result'=>$result, 'message' =>$inscriptionNumber );
    
   }
   
   
   

    
    protected function subTokenFilter(&$token)
    {
        return array_intersect_key($token, array_flip(array('access_token', 'refresh_token', 'lifetime', 'createTime')));
    }
    

   
}     




