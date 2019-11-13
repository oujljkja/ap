<?php
/**
 * Created by PhpStorm.
 * User: ffctv
 * Date: 2019/11/6
 * Time: 16:47
 */


namespace Qwadmin\Controller;

class WebController extends ComController
{

    public function index()
    {

        $vars = M('setting')->where('type=1')->select();
        $this->assign('vars', $vars);
        $this->display();
    }

}