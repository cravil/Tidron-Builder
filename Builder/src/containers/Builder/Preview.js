/*eslint no-unused-vars: "off"*/
import React, {Component} from 'react'
import NavBar from './../../ui/template/NavBar'
import 'react-sortable-tree/style.css'; // This only needs to be imported once in your app
import Config from   '../../config/app';
import Wizzard from "./../../ui/template/Wizzard";
import firebase from '../../config/database'
import T from './../../translations/translate'
var QRCode = require('qrcode.react');
var request = require('superagent');

class Preview extends Component {
  constructor(props){
    super(props);

    this.state={
      name: "",
      linkToApp: "",
      uniqueID:""
    }

    this.getUniiQueID=this.getUniiQueID.bind(this);
  }

  componentDidMount(){
    var _this=this;
    var wholeApp = firebase.app.database().ref(Config.appEditPath);
    wholeApp.on('value', function(snapshot) {
      _this.setState({
        name:snapshot.val().name
      })
    });

    if(Config.appEditPath){
      this.getUniiQueID();
    }
    

    if(Config.isSaaS){
      _this.getAppLink();
    }else{
      _this.setState({
        linkToApp: "http://bit.ly/uniexporeact"
      })
    } 
  }

  getUniiQueID(){
    var url='https://install.reactappbuilder.com/appids/index.php';
    var query = { action: 'getID', string: Config.firebaseConfig.apiKey+";"+Config.firebaseConfig.projectId+";"+Config.appEditPath };
    var _this=this;
		request.get(url).query(query).end((err, res) => {
      // Do something
      console.log(res);
      _this.setState({
        uniqueID:parseInt(res.text)
      })
    });
  }

  getAppLink(){
    var _this = this;
    var linkInfo = firebase.app.database().ref('/rab_saas_site');
    linkInfo.on('value', function(snapshot) {
      _this.setState({
        linkToApp: snapshot.val().linkToPreviewApp
      })
    });
  }


  getPreviewContent(){
    return (
      <div>
        <p><h3>{T.ts("Unique ID")+":"+this.state.uniqueID}</h3></p>
        <br />
        
        <iframe 
        src="https://appetize.io/embed/8bnmakzrptf1hv9dq7v7bnteem?autoplay=false&debug=false&device=iphonex&deviceColor=black&embed=true&orientation=portrait&screenOnly=false&xDocMsg=true&xdocMsg=true&params=%7B%22EXKernelLaunchUrlDefaultsKey%22:%22exp:%2F%2Fexp.host%2F@dimovdaniel%2Fappbuilderonline%22,%22EXKernelDisableNuxDefaultsKey%22:true%7D&osVersion=11.4" 
        width="313px" height="800px" frameBorder="0" scrolling="no"></iframe>
        <div>
        </div>

        <br /><br /><br />
      </div>
    )
  }


  render() {

   return (
    <div className="main-panel" style={{'paddingRight':'15px'}}>
    <NavBar  currentLangData={this.props.route.currentLangData}></NavBar>
    <Wizzard 
      title={this.state.name?T.td("App Preview")+ ": " +this.state.name:T.td("App Preview")}
      steps={[{
        name:"preview",
        icon:"cloud_download",
        title:T.td("Preview your app"),
        active:"active",
        label1:T.ts("Just click on the device"),
        label2:T.ts("And enter your unique ID"),
        content:this.getPreviewContent()
      }]}
    />
    </div>
   )
  }
}
export default Preview;