import React, { Component ,useState} from 'react';
import { Image,AsyncStorage,Alert,StyleSheet,View , ScrollView } from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body} from 'native-base';
import Search, {call} from '../components/src/components/Search';
import { render } from 'react-dom';
import axios from 'axios';
import Img1 from '../components/src/components/Img1';
import Img2 from '../components/src/components/Img2';
import Img3 from '../components/src/components/Img3';
import Geocoder from 'react-native-geocoding';
import { API_KEY } from '../components/src/components/Key';
import { IonAlert, IonButton, IonContent } from '@ionic/react';

export default class Details extends Component{
    //const var2= navigation.state.params.data
    constructor() {
      super()
      this._retrieveData(); 
      // this.DisplaySuggest();
      this.checkState = false;
      this.places = ['Anuradhapura', 'Polonnaruwa', 'Dambulla', 'Kurunegala', 'Kandy','Colombo','Trincomalee','Galle',
      'Nuwara Eliya','Jaffna','Kataragama','Matara','Ella','Negombo','Dehiwala','Kithulgala','Madu','Badulla'];
      this.state = {
        tinput :"",
        pname : "",
        pnumber:"",
        p0address:"",
        p1address:"",
        p2address:"",
        city:"",
        p4address:"",
        p5address:"",
        p6address:"",
        prating:"",
        pphotoRef:"",
        pphotoRef0:"",
        pphotoRef1:"",
        pphotoRef2:"",
        photosugg1:"",
        pbusiness:"",
        pOpenHour0:"",
        pOpenHour1:"",
        pOpenHour2:"",
        pOpenHour3:"",
        pOpenHour4:"",
        pOpenHour5:"",
        pOpenHour6:"",
        selecteddate:"",
        vicinity:"",
        //from backend for prediction
        poya:"",
        holidayName:"",
        publicHoliday:"", 
        bankHoliday:"",      
        mercantile:"",      
        weather:"",   
        crowd:2, 
        nearPlace:[],
        nearPlacePic:[],  
        nearPlaceType:[],    
        nearState:false,
        longitute:"",
        latitude:""                                                                                                                        
      }      
      
      //this.getDetail();
      //this.detailsURI = 'https://maps.googleapis.com/maps/api/place/details/json?place_id='+this.state.tinput+'&fields=name,rating,formatted_phone_number,adr_address&key=AIzaSyB83SfaccVha2jO_M3UD9_ly5x7I2nbMpo';
    }

    _retrieveData = async () => {
      
      try {
        const value = await AsyncStorage.getItem('super');
        const dates=await AsyncStorage.getItem('date');
        this.setState({selecteddate:dates})
        if(this.state.selecteddate===null){
          console.log("date null");
          this.setCurrentDate();
        }
        this.setState({tinput:value})         
        if (value !== null) {
          // We have data!!
          // console.log(value);
          //Alert.alert(value);
          this.getDetail(value);
          return value; 
        }
      } catch (error) {
        // Error retrieving data
      }
    };
    setCurrentDate = async () =>{
      var date = new Date().getDate(); //Current Date
      var month = new Date().getMonth() + 1; //Current Month
      var year = new Date().getFullYear(); //Current Year
      if(month<10){
        month = "0"+month;
      }if(date<10){
        date = "0"+date;
      }
      this.state.selecteddate = year+"-"+month+"-"+date;
      await AsyncStorage.setItem('date',this.state.selecteddate);
    }

    handleChangeText(){
      var obj1 = {
        date:this.state.selecteddate,
        city:this.state.city,
      }
      // console.log('date from object : '+obj1.date);
      // console.log('city from object : '+obj1.city);
      axios.post('https://xplorelanka.herokuapp.com/getPrediction',obj1)
      .then(res => {        
        this.setState({
          ...this.state,
          poya:res.data.poya,
          crowd:res.data.crowd,
          holidayName:res.data.holidayName,
          publicHoliday:res.data.public,
          bankHoliday:res.data.bank,
          mercantile:res.data.mercantile,
          weather:res.data.weather,
        })
        // console.log(this.state.poya);
        // console.log(this.state.crowd);
        // console.log(this.state.holidayName);
        // console.log(this.state.publicHoliday);
        // console.log(this.state.bankHoliday);
        // console.log(this.state.mercantile);
        // console.log(this.state.weather);
      })
      .catch(error=>{
        // console.log('[ERROR] in getting prediction from back end error = '+error);
      });
    }

    getDetail =async (value) => {  
      //const val = JSON.stringify(this._retrieveData());      
      const detailsURI = 'https://maps.googleapis.com/maps/api/place/details/json?place_id='+value+'&fields=name,business_status,opening_hours,rating,formatted_phone_number,address_components,vicinity,photos&key='+API_KEY+'';      
      //Alert.alert(detailsURI)
      axios.get(detailsURI)
      .then(res => {
        //Alert.alert(JSON.stringify(res.data.result.name))
        this.setState({
          ...this.state,
          pname: res.data.result.name,
          pnumber: res.data.result.formatted_phone_number,
          p0address: res.data.result.address_components[0].long_name,
          p1address: res.data.result.address_components[1].long_name,
          p2address: res.data.result.address_components[2].long_name,
          city: res.data.result.address_components[3].long_name,
          p4address: res.data.result.address_components[4].long_name,
          p5address: res.data.result.address_components[5].long_name,
          p6address: res.data.result.address_components[6].long_name,
          prating: res.data.result.rating,
          pphotoRef: res.data.result.photos[0].photo_reference,
          pbusiness: res.data.result.business_status,
          pOpenHour0: res.data.result.opening_hours.weekday_text[0],
          pOpenHour1: res.data.result.opening_hours.weekday_text[1],
          pOpenHour2: res.data.result.opening_hours.weekday_text[2],
          pOpenHour3: res.data.result.opening_hours.weekday_text[3],
          pOpenHour4: res.data.result.opening_hours.weekday_text[4],
          pOpenHour5: res.data.result.opening_hours.weekday_text[5],
          pOpenHour6: res.data.result.opening_hours.weekday_text[6],
          vicinity:res.data.result.vicinity,
        });
        // console.log('vicinity : '+this.state.vicinity);
        // console.log('city : '+this.state.p2address);
        this.handleChangeText();
        return JSON.stringify(res.data.result);
      })
      .catch(error=>{
        // console.log("[ERROR] - getDetails() : "+error);
        this.withLessDate(value);
      });        
   }

   withLessDate =async (value) => {  
    this.checkState =true;    
    const detailsURI = 'https://maps.googleapis.com/maps/api/place/details/json?place_id='+value+'&fields=geometry,name,business_status,opening_hours,rating,formatted_phone_number,address_components,vicinity,photos&key='+API_KEY+'';      
    axios.get(detailsURI)
    .then(res => {
      // console.log(res.data.result.geometry.location.lat);
      // console.log(res.data.result.geometry.location.lng);
      var cityname = '';
      for(var i = 0 ;i<19;i++){
        if(res.data.result.address_components[0].long_name==this.places[i]){
          cityname=res.data.result.address_components[0].long_name;
        }if(res.data.result.address_components[1].long_name==this.places[i]){
          cityname=res.data.result.address_components[1].long_name;
        }if(res.data.result.address_components[2].long_name==this.places[i]){
          cityname=res.data.result.address_components[2].long_name;
        }if(res.data.result.address_components[3].long_name==this.places[i]){
          cityname=res.data.result.address_components[3].long_name;
        }
      }
      this.setState({
        pname: res.data.result.name,
        pnumber: res.data.result.formatted_phone_number,
        p0address: res.data.result.address_components[0].long_name,
        p1address: res.data.result.address_components[1].long_name,
        city: cityname,
        pphotoRef: res.data.result.photos[0].photo_reference,
        pphotoRef0: res.data.result.photos[3].photo_reference,
        pphotoRef1: res.data.result.photos[1].photo_reference,
        pphotoRef2: res.data.result.photos[2].photo_reference,
        vicinity:res.data.result.vicinity,
        longitute:res.data.result.geometry.location.lat,
        latitude:res.data.result.geometry.location.lng,
      });
      // console.log('vicinity : '+this.state.vicinity);
      // console.log('city : '+this.state.city);
      console.log('latitude: '+this.state.latitude);
      console.log('latitude: '+this.state.longitute);
      this.handleChangeText();
      this.DisplaySuggest();
      return JSON.stringify(res.data.result);
    })
    .catch(error=>{
      // console.log("[ERROR] withLessData()  : "+error);
    });        
 }

//  DisplaySuggest(){
//   // console.log('longitude in display = '+lat);
//   // console.log('longitude in display = '+lng);
//   const detailsURI = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location= '+lng+','+lat+'&radius=100000&types=place_of_worship&key='+API_KEY+'';      
//   axios.get(detailsURI)
//   .then(res => {
//     this.state.photosugg1=res.data.results.photo[0].photo_reference;
//     // this.setState({
//     //   photosugg1: res.data.results.photos[0].photo_reference,
//     // });
//     // console.log(objx)
//   })
//   .catch(error=>{
//     //console.log("[ERROR] DisplaySuggest()  : "+error);
//   });
// }

   test1= async()=>{
    const place1 = this.state.pname;
    await AsyncStorage.setItem('plna',place1);
    const population = this.state.crowd;
    const crowd=population.toString();
    await AsyncStorage.setItem('crowd',crowd);
    // console.log(crowd);
    const weather = this.state.weather;
    await AsyncStorage.setItem('weather',weather);
    // const holiname = this.state.holidayName;
    // await AsyncStorage.setItem('holi',holiname);
    // var obj2 = {
    //   poya:this.state.poya,
    //   publicHoliday:this.state.publicHoliday,
    //   bankHoliday:this.state.bankHoliday,
    //   mercantile:this.state.mercantile,
    // }
    // await AsyncStorage.setItem('holiday',obj2);

   }

    render() {
      //const placeID = this.state.tinput;
      const placename = this.state.pname;
      const number = this.state.pnumber;
      var address0 = this.state.p0address;
      var address1 = this.state.p1address;
      var address2 = this.state.p2address;
      var city = this.state.city;
      AsyncStorage.setItem('city',city);
      var address4 = this.state.p4address;
      var address5 = this.state.p5address;
      var address6 = this.state.p6address;
      var rating = this.state.prating;
      const photo = this.state.pphotoRef;
      const photo0 = this.state.pphotoRef0;
      const photo1 = this.state.pphotoRef1;
      const photo2 = this.state.pphotoRef2;
      const photo3 = this.state.photosugg1;
      // let photosuggesion1 = "";
      // let photosuggesion2 = "";
      // let photosuggesion3 = "";
      const bussiness = this.state.pbusiness;
      const openhour0 = this.state.pOpenHour0;
      const openhour1 = this.state.pOpenHour1;
      const openhour2 = this.state.pOpenHour2;
      const openhour3 = this.state.pOpenHour3;
      const openhour4 = this.state.pOpenHour4;
      const openhour5 = this.state.pOpenHour5;
      const openhour6 = this.state.pOpenHour6;
      const lat = this.state.latitude;
      const lng = this.state.longitute;
      const choosendate = this.state.selecteddate;
      const vicinity = this.state.vicinity;
      this.test1();
      const DisplayData = () =>{
        if(this.checkState==true){
          return(
            <View>
              <Text style={{color:'blue'}}>Address</Text>
              <Text>{city}</Text>
              <Text>{number}</Text>                    
            </View>
          );
        }else{
        return(
          <View>
            <Text style={{color:'blue'}}>Address</Text>
            <Text>{address0}</Text>
            <Text>{address1}</Text>
            <Text>{address2}</Text>
            <Text>{address4}</Text>
            <Text>{address5}</Text>
            <Text>{address6}</Text>
            <Text>{number}</Text>
            <Text style={{color:'blue'}}>Bussiness Status</Text>
            <Text>-----------------</Text>
            <Text>{bussiness}</Text>
            <Text style={{color:'blue'}}>Open Time</Text>  
            <Text>-----------------</Text>
            <Text>{openhour0}</Text>
            <Text>{openhour1}</Text> 
            <Text>{openhour2}</Text> 
            <Text>{openhour3}</Text> 
            <Text>{openhour4}</Text> 
            <Text>{openhour5}</Text> 
            <Text>{openhour6}</Text>
          </View>
        );
        }
      }
      // let key = '';
      
      // let newArray = this.state.nearPlace.map((place, i) => {
      //   var loc = 'loc-'+i;
      //   if (key = loc) {
          
      //     this.state.nearPlaceType=place.types;
      //     // for(let j=0;j<this.state.nearPlaceType.length;j++){
      //     //   if(this.state.nearPlaceType[j]!='lodging'){
      //     //     this.state.nearState=true;
      //     //   }            
      //     // }
      //     let k =0;
      //     // let count = 1;
      //     while((this.state.nearPlaceType[k]=='lodging')||(k!=this.state.nearPlaceType.length)){           
      //       if(this.state.nearPlaceType[k]!='lodging'){
      //         //console.log('state true : ');
      //         this.state.nearState=true;
      //       }else{
      //         //console.log('state false : ');
      //         this.state.nearState=false;
      //       }
      //       k=k+1;
      //     }
      //     if(this.state.nearState=true){
      //       console.log('------------------------------------');
      //       console.log(place.name);
      //       console.log(place.types);
      //       //res.data.result.photos[0].photo_reference,
      //       console.log(place.photos[0].photo_reference);
            
      //         photosuggesion1 = place.photos[0].photo_reference;
            
            
      //         photosuggesion2 = place1.photos[1].photo_reference;
            
            
      //         photosuggesion3 = place2.photos[2].photo_reference;
            
      //       this.state.nearPlacePic=place.photos;
      //       //console.log(this.state.nearPlacePic);
      //       console.log('------------------------------------');
      //       // count = count +1;
      //     }
          
          
      //   };
      // });

      
      return (
        <Container>
          {/* <Header /> */}
          <Content>
            <Card style={{flex: 0,}}>
              <CardItem>
                <Left>
                  <Thumbnail source={{uri: 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference='+photo+'&key='+API_KEY+''}} />
                  <Body>
                    <Text>{placename}</Text>
                    <Text note>{choosendate}</Text>
                  </Body>
                </Left>
              </CardItem>
              <CardItem>
                <Body>
                  <Image source={{uri: 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference='+photo+'&key='+API_KEY+''}}
                  style={{height: 300, width: 380, flex: 1}}/>
                  <View style={{marginTop:30}}>
                    <Img1/>
                    {/* <Img2/> */}
                    <Img3/>
                  </View>
                  {DisplayData()}
                  <Text style={{color:'blue'}}>Iconic {placename}</Text>
                  {/* {DisplaySuggest()} */}
                  <View style={{borderRadius:30, width:338, height:300}}>
                    <ScrollView horizontal={true}>
                      <View style={{marginTop:15, marginRight:10, marginLeft:10, backgroundColor:'#fff', borderRadius:30, height: 270}}>
                        <Image source={{uri:'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference='+photo0+'&key='+API_KEY+''}}style={{width: 268, height: 270, borderRadius:30}}/>
                      </View>
                      <View style={{marginTop:15, marginRight:10, backgroundColor:'#fff', borderRadius:30, height: 270}}>
                        <Image source={{uri:'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference='+photo1+'&key='+API_KEY+''}}style={{width: 268, height: 270, borderRadius:30}}/>
                      </View>
                      <View style={{marginTop:15, marginRight:10, backgroundColor:'#fff', borderRadius:30, height: 270}}>
                        <Image source={{uri:'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference='+photo2+'&key='+API_KEY+''}}style={{width: 268, height: 270, borderRadius:30}}/>
                      </View>
                    </ScrollView>
                  </View>
                  {/* <Text>{lng}</Text>
                  <Text>{lat}</Text> */}
                </Body>
              </CardItem>
              <CardItem>
                <Left>
                  <Button transparent textStyle={{color: '#87838B'}}>
                    <Icon name="md-eye" />
                    <Text>{rating}</Text>
                  </Button>
                </Left>
              </CardItem>
            </Card>
          </Content>
        </Container>
      );
    }
}
