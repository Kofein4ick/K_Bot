import React, { useEffect, useState} from 'react';
import {Button,Container,Accordion} from 'react-bootstrap';
import {fetchFAQ_Priv_Q_A} from '../components/Api';
import 'react-toastify/dist/ReactToastify.css';
import { CHAT_ROUTE } from '../utils/consts';
import Loader from '../components/Loader';
import Error_page from './Error_page';

const FAQ_Priv = () =>{
const [flag,setFlag]=useState(false)//вспомогательный стейт для useEffect
const [tromp,setTromp]=useState([])
const [isLoaderVisible, setIsLoaderVisible] = useState(false)
const [error,setError]=useState(false)

document.body.style = 'background: #8ad4ff'
useEffect(()=>{//При загрузке странице делаем один раз запрос на получение первого вопроса и его ответов
  if(flag===false)
    {
      setIsLoaderVisible(true)
      let FAQ1=[]
      fetchFAQ_Priv_Q_A().then(data=>{
        FAQ1.push(faq(data,1))
        FAQ1.push(faq(data,2))
        FAQ1.push(faq(data,3))
        FAQ1.push(faq(data,4))
        FAQ1.push(faq(data,5))
        setTromp(FAQ1)
        setIsLoaderVisible(false)
      }).catch(err => { 
        if (err.response) {
          setError(500)
        } else if (err.request) {
          setError(400) 
        } else { 
          setError(900) 
        } 
      })
      setFlag(true)
    }
  },[])


function faq(data,id){
let el = data.post.q_a.map((element,index)=>{
  if(element.T_id===id) 
    return <Accordion.Item key={`${element.T_id*element.id*10}`} eventKey={`${element.T_id*element.id*10}`}>
       <Accordion.Header style={{textAlign:'justify'}}>{element.Qtext}</Accordion.Header>
       <Accordion.Body style={{textAlign:'justify', backgroundColor: '#FFFFE0' }}>{getFormatedText(element.Atext,element)}</Accordion.Body>
    </Accordion.Item>
   })
  return el 
}

//Рамзетка текста
const getFormatedText = (text,message) => {
  if (text.includes('\n')){
    return text.split('\n').map((str, i) => {
      str=getHyperLink(str)
      return <p key={`p_${i}`}>{str}</p>})
  }
  else {
    return text=getHyperLink(text)
  }
}

//Вставка гиперссылок
const getHyperLink = (text) => {  
  if (text.includes('LINK')){
    let links
    return text.split('LINK').map((str, i) =>{
    if(i%2!==0){str=str.split('SOURCE')
    links=str[1]
    str[1]=''
      return <a href={links} key={`p_${i}`} target='_blank' rel="noreferrer">{str}</a>}
    else{return str}})
  }
  else {
    return text
  }
}
const button = <Button size='sm'  style={{marginTop:10,marginBottom:5}} href={CHAT_ROUTE}>Вернуться назад</Button>
const FAQ =
<Accordion alwaysOpen>
<Accordion.Item eventKey='1'>
      <Accordion.Header style={{textAlign:'justify'}}>{'Пенсионное обеспечение'}</Accordion.Header>
      <Accordion.Body style={{ backgroundColor: '#F5DEB3'}}>{tromp[0]}</Accordion.Body>
</Accordion.Item>
<Accordion.Item eventKey='2'>
      <Accordion.Header style={{textAlign:'justify'}}>{'Налоги'}</Accordion.Header>
      <Accordion.Body style={{ backgroundColor: '#F5DEB3' }}>{tromp[1]}</Accordion.Body>
</Accordion.Item>
<Accordion.Item eventKey='3'>
      <Accordion.Header style={{textAlign:'justify'}}>{'Пенсионерам и инвалидам'}</Accordion.Header>
      <Accordion.Body  style={{ backgroundColor: '#F5DEB3' }}>{tromp[2]}</Accordion.Body>
</Accordion.Item>
<Accordion.Item eventKey='4'>
      <Accordion.Header style={{textAlign:'justify'}}>{'Социальные пособия'}</Accordion.Header>
      <Accordion.Body style={{ backgroundColor: '#F5DEB3' }}>{tromp[3]}</Accordion.Body>
</Accordion.Item>
<Accordion.Item  eventKey='5'>
      <Accordion.Header style={{textAlign:'justify'}}>{'Декрет'}</Accordion.Header>
      <Accordion.Body style={{ backgroundColor: '#F5DEB3' }}>{tromp[4]}</Accordion.Body>
</Accordion.Item>
</Accordion>

const element = error ? Error_page(error) : (isLoaderVisible ? <Loader/> :
<Container className="d-flex flex-column justify-content-center align-items-center">
<h2 style={{marginTop:20,marginBottom:20,textAlign:'center'}}>Социальные гарантии, льготы, пенсии</h2>
<Container className="d-flex justify-content-center align-items-center"
fluid>
<Container  className="d-flex flex-column" style={{maxWidth:'160vh',minWidth:'40vh',
  maxHeight:window.innerHeight-10, overflowY:'auto', overflowX:'auto' ,borderRadius:10}}>
            {FAQ}
        </Container>
</Container>
{button}
<h3 className="d-flex align-items-center" style={{fontSize:'70%',color:'grey',textAlign:'justify'}}>
Все материалы сайта имеют справочно-информационный характер и представлены для ознакомления и анализа. Мы не несем ответственность за действия пользователей</h3>
</Container>)

//Сама страница
  return (<Container className="d-flex flex-column align-items-center" >
      {element}
    </Container>
  );
};

export default FAQ_Priv;