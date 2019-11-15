<?php
/**
 *
 * 版权所有：新睿社区<qwadmin.010xr.com>
 * 作    者：素材水<hanchuan@010xr.com>
 * 日    期：2016-09-20
 * 版    本：1.0.0
 * 功能说明：文章控制器。
 *
 **/

namespace Qwadmin\Controller;

use Vendor\Tree;

class CategoryController extends ComController
{

    public function index()
    {


        $category = M('category')->field('id,pid,name,o')->order('o asc')->select();
        $category = $this->getMenu($category);
        $this->assign('category', $category);
        $this->display();
    }
    //添加网站权限
    public  function web_jurisdiction(){
        $web =  M("union")->select();
        $member = M('member')->select();
        $user  = M("member")->where(array('id'=>$_SESSION['uid']))->find();
        if($user['web_id']){
            $web_id =  explode(',',$user['web_id']);
            foreach ($web as $key=>$value){
               foreach ($web_id as $v){
                   if($value['id']==$v){
                       $web[$key]['st_id'] =1;
                   }
               }
            }
        }
        if($_POST){
            $_POST['rules'];
            if($_POST['rules']){
               $data['web_id'] =  implode(',',$_POST['rules']);
            }
            if(!$_POST['uid']){
                $this->error('用户不存在！', U("Category/web_jurisdiction"));
                exit;
            }
            M('member')->data($data)->where(array('uid'=>$_POST['uid']))->save();
            $this->success('操作成功！');
            exit;
        }
        $this->assign('member',$member);
        $this->assign('web',$web);
        $this->assign('user',$user);
        $this->display();
    }

   //网站列表
    public  function  web(){

        $vars = M('web')->select();
        $this->assign('list', $vars);
        $this->display();
    }
    //添加网站
    public function web_add(){
        if($_POST){
            if($_POST['name']){
               $data['name'] = trim($_POST['name']);
            }else{
                $this->error('网站名字为空！', U("Category/web_add"));
                exit;
            }
            $web =  M("web")->where(array("name"=>$data['name']))->find();
            if($web['id']){
                $this->error('网站名字以存在！', U("Category/web_add"));
                exit;
            }
            if($_POST['ip']){
                $data['ip'] = trim($_POST['ip']);
            }else{
                $this->error('ip为空！', U("Category/web_add"));
                exit;
            }
            if($_POST['file_name']){
                $data['file_name'] = trim($_POST['file_name']);
            }else{
                $this->error('文件名为空！', U("Category/web_add"));
                exit;
            }
            $data['code'] = $_POST['code'];
            $data['zhanghao'] = trim($_POST['zhanghao']);
            $data['pass'] = trim($_POST['pass']);
            $data['time'] = time();
            M("web")->data($data)->add();
            $this->success('操作成功！');
            exit;
        }
        $this->display();
    }
    //添加网站
    public function web_up(){
        $id = $_GET['id'];
        if($_POST){
            $id = $_POST['id'];
            if($_POST['name']){
                $data['name'] = trim($_POST['name']);
            }else{
                $this->error('网站名字为空！', U("Category/web_add"));
                exit;
            }
            if($_POST['ip']){
                $data['ip'] = trim($_POST['ip']);
            }else{
                $this->error('ip为空！', U("Category/web_add"));
                exit;
            }
            if($_POST['file_name']){
                $data['file_name'] = trim($_POST['file_name']);
            }else{
                $this->error('文件名为空！', U("Category/web_add"));
                exit;
            }
            if($_POST['zhanghao']){
                $data['zhanghao'] = trim($_POST['zhanghao']);
                $data['pass'] = trim($_POST['pass']);
            }

           // $data['key'] = 2;
           // $data['code'] = $_POST['code'];
            M("web")->data($data)->where(array("id"=>$id))->save();
            $this->success('操作成功！');
            exit;
        }
        $this->assign('uid',$_SESSION['uid']);
        $row =  M("web")->where(array("id"=>$id))->find();
        $this->assign("row",$row);
        $this->assign("id",$id);
        $this->display();
    }
    //广告
    public function  advert_content(){
        $id =  $_GET['id'];
        //$row =  M("advert_content")->where(array('advert_id'=>$id))->find();
        $advert =  M("web")->where(array('id'=>$id))->find();
        //if($advert['key']!=$row['key']){
        $row['code'] = $advert['code'];
        //}
        //if(!$row['code']){
        //    $row['code'] = $advert['code'];
        //}
        if($_POST){
          $id = $_POST['id'];
          $data['advert_id'] = $id;
          $advert =  M("web")->where(array('id'=>$id))->find();
          $data['advert_in'] = trim($_POST['advert_in']);
          $js =  $this->read_file_content("./js/{$advert['file_name']}");
          if( $_POST['code']){
              $js =  $_POST['code'];

              $i = explode("<edv>",$js);
              $z = array();
              foreach ($i as $key=>$v){
                  if($key>0){
                      $z=  explode("</edv>",$v);
                      $ro[] = $z[0];
                  }
              }

              M('label')->where(array("web_id"=>$id))->delete();
              foreach ($ro as $v){
                  M('label')->data(array('label'=>$v,'web_id'=>$id,'time'=>time()))->add();
                  $ad =  M("advert")->where("label = '{$v}'")->find();
                  if($ad){
                      $js =  str_ireplace("{edv}{$v}{/edv}",$ad['content'],$js);
                  }

              }
          }

          $data['code'] = $js;
          $data['modify'] = $_SESSION['think']['admin_user_id'];
          $data['up_time'] = time();

          $dir = iconv("UTF-8", "GBK", "./js/{$advert['name']}");
          if (!file_exists($dir)){
              mkdir ($dir,0777,true);
          }

echo 22222;exit;

          $myfile = fopen("./js/{$advert['name']}/{$advert['file_name']}", "w") or die("Unable to open file!");

          fwrite($myfile, $js);
         // $conn = ftp_connect("{$_POST['ip']}");

          // 使用username和password登录
          //ftp_login($conn, "'{$_POST['zhanghao']}'", "'{$_POST['pass']}'");


          //ftp_put($conn, "{$advert['file_name']}", "./js/{$advert['name']}/{$advert['file_name']}", FTP_ASCII);

          //  $conn = ftp_connect("98.126.64.26");

            // 使用username和password登录
            //ftp_login($conn, 'js', 'macbookair99');


           // ftp_put($conn, “xyz.txt”, “abc.txt”, FTP_ASCII);
          //M("web")->data(array('key'=>1))->where(array("id"=>$id))->save();
            $row =  M("advert_content")->where(array('advert_id'=>$id))->find();
          if($row['id']){
              $data['key']=1;
              M("advert_content")->data($data)->where(array("advert_id"=>$id))->save();
              $this->success('操作成功！');
              exit;
          }else{
              $data['add_time'] = time();
              $data['key']=1;
              M("advert_content")->data($data)->add();
              $this->success('操作成功！');
              exit;
          }
        }


        $this->assign("row",$row);
        $this->assign("advert",$advert);
        $this->assign("id",$id);
        $this->display();

    }

    public function read_file_content($FileName)
    {

        $fp=fopen($FileName,"r");
        $data="";
        while(!feof($fp))
        {

            $data.=fread($fp,4096);
        }
        fclose($fp);
        return $data;
    }

    //联盟列表
    public function union()
    {
        if($_SESSION['user']['web_id']&&$_SESSION['user']['uid']!=1){
            $vars = M('union')->where(" id in({$_SESSION['user']['web_id']}) ")->select();
        }else{

            $vars = M('union')->select();
        }

        $this->assign('list', $vars);
        $this->display();
    }
    //修改联盟
    public  function  union_up(){

        $id =  $_GET['id'];
        $row = M("union")->where(array("id"=>$id))->find();

        if($_POST){
            $id = $_POST['id'];
            if($_POST['status']){
                $data['status'] = 1;
            }else{
                $data['status'] = 2;
            }
            if($_POST['name']){
                $data['name'] = $_POST['name'];
            }else{
                $this->error('联盟名字为空！', U("Category/union_up",array("id"=>$id)));
                exit;
            }
            if($_POST['label']){
                $data['label'] = $_POST['label'];
            }else{
                $this->error('联盟标签为空！', U("Category/union_up",array("id"=>$id)));
                exit;
            }

            M('union')->data($data)->where("id='{$id}'")->save();
            $this->success('操作成功！');
            exit;
        }
        $this->assign('row', $row);
        $this->display();
    }
    //添加联盟
    public  function union_in(){

        if($_POST){
            if($_POST['status']){
                $data['status'] = 1;
            }else{
                $data['status'] = 2;
            }
            if($_POST['name']){
                $data['name'] = trim($_POST['name']);
            }else{
                $this->error('联盟名字为空！', U("Category/union_in"));
                exit;
            }
            if($_POST['label']){
                $data['label'] = trim($_POST['label']);
            }else{
                $this->error('联盟标签为空！', U("Category/union_in"));
                exit;
            }
            $data['time'] = time();
            $o =  M('union')->where(" name ='{$data['name']}' or label = '{$data['label']}'  ")->find();
            if($o['id']){
                $this->error('联盟名字/联盟标签以存在！', U("Category/union_in"));
                exit;
            }
            M('union')->data($data)->add();
            $this->success('操作成功！', U("Category/union"));
            exit;
        }
        $this->display();
    }

    //广告列表
    public function advert(){
        $id = $_GET['id'];
        $list = M("advert")->where(array("union_id"=>$id))->select();
        foreach($list as $key=>$r){
            if($r['status']==1){
                $list[$key]['status'] = "开启";
            }else{
                $list[$key]['status'] = "关闭";
            }
           $list[$key]['label'] = '{edv}'.$r['label'].'{/edv}';
           $member =  M("member")->where(array("id"=>$r['modify']))->find();
           $list[$key]['modify'] = $member['user'];
        }



        $this->assign('list', $list);
        $this->assign('id', $id);
        $this->display();
    }
    //修改广告
    public  function  advert_up(){

        $id =  $_GET['id'];
        $row = M("advert")->where(array("id"=>$id))->find();

        if($_POST){
            if($_POST['id']){
                $id = $_POST['id'];
                if(!$_POST['code']){
                    $this->error('请填写内容！', U("Category/advert_up",array('id'=>$id)));
                }
                if($_POST['status']){
                    $data['status'] = 1;
                }else{
                    $data['status'] = 2;
                }
                $data['up_time'] = time();
                $data['name'] = trim($_POST['name']);
                $data['content'] = $_POST['code'];
                $data['modify'] = $_SESSION['think']['admin_user_id'];
                M('advert')->where(array('id'=>$id))->data($data)->save();
                $this->success('操作成功！', U("Category/advert_up",array('id'=>$id)));
                exit;
            }else{
                $this->error('广告id不存在！', U("Category/advert_up",array('id'=>$id)));
            }
        }
        $this->assign("row",$row);
        $this->assign('id', $id);
        $this->display();
    }
    //添加广告
    public  function advert_in(){
        $id =  $_GET['id'];

        if($_POST){
           if($_POST['id']){
               $id = $_POST['id'];
               if(!$_POST['code']){
                   $this->error('请填写内容！', U("Category/advert_in",array('id'=>$id)));
               }
               $data['content'] = $_POST['code'];
               $data['union_id'] = $_POST['id'];

               $data['add_time'] = time();
               $data['up_time'] = time();
               $data['name'] = trim($_POST['name']);

               $data['modify'] = $_SESSION['think']['admin_user_id'];
               $o =  M('advert')->where(array('union_id'=>$id))->order(" id desc")->find();
               $lid = 1;
               if($o['id']){
                  $lid =   $o['id']+1;
               }
               $union = M("union")->where(array('id'=>$id))->find();
               if($union){
                    $data['label'] = "".$union['label']."_".$lid."";
               }else{
                   $this->error('联盟id不存在！', U("Category/advert_in",array('id'=>$id)));
               }

               //ftp


            //上传文件ssh2
               /*
               $connection =  ssh2_connect('47.91.221.244', 1717);
               $user = "root";
               $pass = "Macbookair99";
               if (ssh2_auth_password($connection,$user,$pass))  {
                   ssh2_scp_send($connection, 'index.php', '/data/web/index.php', 0644);
               }else{
                   die("Authentication Failed...");
               }
                */
               M('advert')->data($data)->add();
               $this->success('操作成功！', U("Category/advert",array('id'=>$id)));
               exit;
           }else{
               $this->error('联盟id不存在！', U("Category/advert_in",array('id'=>$id)));
           }
        }
        $this->assign('id', $id);
        $this->display();
    }
    public function del()
    {

        $id = isset($_GET['id']) ? intval($_GET['id']) : false;
        if ($id) {
            $data['id'] = $id;
            $category = M('category');
            if ($category->where('pid=' . $id)->count()) {
                die('2');//存在子类，严禁删除。
            } else {
                $category->where('id=' . $id)->delete();
                addlog('删除分类，ID：' . $id);
            }
            die('1');
        } else {
            die('0');
        }

    }

    public function edit()
    {

        $id = isset($_GET['id']) ? intval($_GET['id']) : false;
        $currentcategory = M('category')->where('id=' . $id)->find();
        $this->assign('currentcategory', $currentcategory);

        $category = M('category')->field('id,pid,name')->where("id <> {$id}")->order('o asc')->select();
        $tree = new Tree($category);
        $str = "<option value=\$id \$selected>\$spacer\$name</option>"; //生成的形式
        $category = $tree->get_tree(0, $str, $currentcategory['pid']);

        $this->assign('category', $category);
        $this->display('form');
    }

    public function add()
    {

        $pid = isset($_GET['pid']) ? intval($_GET['pid']) : 0;
        $category = M('category')->field('id,pid,name')->order('o asc')->select();
        $tree = new Tree($category);
        $str = "<option value=\$id \$selected>\$spacer\$name</option>"; //生成的形式
        $category = $tree->get_tree(0, $str, $pid);

        $this->assign('category', $category);
        $this->display('form');
    }

    public function update($act = null)
    {
        if ($act == 'order') {
            $id = I('post.id', 0, 'intval');
            if (!$id) {
                die('0');
            }
            $o = I('post.o', 0, 'intval');
            M('category')->data(array('o' => $o))->where("id='{$id}'")->save();
            addlog('分类修改排序，ID：' . $id);
            die('1');
        }

        $id = I('post.id', false, 'intval');
        $data['type'] = I('post.type', 0, 'intval');
        $data['pid'] = I('post.pid', 0, 'intval');
        $data['name'] = I('post.name');
        $data['dir'] = I('post.dir','',array('strip_tags','trim'));
        $data['seotitle'] = I('post.seotitle', '', 'htmlspecialchars');
        $data['keywords'] = I('post.keywords', '', 'htmlspecialchars');
        $data['description'] = I('post.description', '', 'htmlspecialchars');
        $data['content'] = I('post.content');
        $data['url'] = I('post.url');
        $data['cattemplate'] = I('post.cattemplate');
        $data['contemplate'] = I('post.contemplate');
        $data['o'] = I('post.o', 0, 'intval');
        if ($data['name'] == '') {
            $this->error('分类名称不能为空！');
        }
        if ($id) {
            if (M('category')->data($data)->where('id=' . $id)->save()) {
                addlog('文章分类修改，ID：' . $id . '，名称：' . $data['name']);
                $this->success('恭喜，分类修改成功！');
                die(0);
            }
        } else {
            $id = M('category')->data($data)->add();
            if ($id) {
                addlog('新增分类，ID：' . $id . '，名称：' . $data['name']);
                $this->success('恭喜，新增分类成功！', 'index');
                die(0);
            }
        }
        $this->success('恭喜，操作成功！');
    }
}
