import React, { useEffect, useState } from 'react';
import {Button,Container,Popover,OverlayTrigger,Accordion} from 'react-bootstrap';
import { fetchAnswer, fetchFAQ_Q_A, fetchItems} from '../components/Api';
import { Grid} from '@mui/material';
import 'react-toastify/dist/ReactToastify.css';
import { first_message,docs_type,themes,test_first_message, docs_first, FAQ_PRIV_ROUTE,FAQ_RESP_ROUTE,FAQ_REG_ROUTE } from '../utils/consts';
import Loader from '../components/Loader';
import Error_page from './Error_page';

const Chat = () =>{
const [messages,setMessage] = useState([]) //стейт, хранящий все сообщения
const [flag,setFlag]=useState(false)//вспомогательный стейт для useEffect
const [tromp,setTromp]=useState([])//стейт, хранящий ответы выпадающего списка
const [isLoaderVisible, setIsLoaderVisible] = useState(false)//стейт лоадера
const [error,setError]=useState(false)//стейт ошибки

document.body.style = 'background: #8ad4ff'

useEffect(()=>{//При загрузке странице делаем один раз запрос на получение первого вопроса и его ответов
  if(flag===false)
    {
      setIsLoaderVisible(true)
      let FAQ1=[]
      //Получение и заполнение выпадающего списка
      fetchFAQ_Q_A(1).then(data=>{
        FAQ1.push(faq(data))
        fetchFAQ_Q_A(2).then(data=>{
          FAQ1.push(faq(data))
          fetchFAQ_Q_A(3).then(data=>{
            FAQ1.push(faq(data))
            }).catch(err => { 
              if (err.response) {
                setError(500)
              } else if (err.request) {
                setError(400) 
              } else { 
                setError(900) 
              } 
            })
          }).catch(err => { 
            if (err.response) {
              setError(500)
            } else if (err.request) {
              setError(400) 
            } else { 
              setError(900) 
            } 
          })
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

        setTromp(FAQ1)
      fetchs(0,first_message)//Вывод приветсвенного сообщения
      setFlag(true)
    }
    const objDiv = document.getElementById("div1");//прокрутка скролла вниз, чтобы новые сообщения были видны всегда
    if(objDiv!==null){ 
      objDiv.scrollTop = objDiv.scrollHeight
     }

  })

function faq(data){
let el = data.post.q_a.map((element,index)=>{
    return <Accordion.Item eventKey={`${element.T_id*element.id*10}`}>
       <Accordion.Header style={{textAlign:'justify'}}>{element.Qtext}</Accordion.Header>
       <Accordion.Body style={{textAlign:'justify', backgroundColor: '#FFFFE0'}}>{getFormatedText(element.Atext,element)}</Accordion.Body>
    </Accordion.Item>
   })
  return el 
}

function fetchs(q_id, message){
if(q_id!==null){
    switch(message.mode){
      case -1://Тест
      fetchAnswer(q_id).then(data=>{
        printMess(data,message,q_id)})//вывод
        break
      case -2://Переход на страницу регистрации
        break
      case -3://Переход на страницу ответственности

        break
      case -4://Переход на страницу привилений
        break
      case -5://Договора
        if(q_id<0){printMess(null,message,q_id)}
        else{
        fetchItems(q_id).then(data=>{
          printMess(data,message,q_id)
        })}
        break
      case 0:
        printMess(null,message,q_id)
        break
    }
}
else{
  printMess(null,message,q_id)
}
  
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
//Занесение соощбений в стейт
function printMess(data,message,q_id){
  let temp3=[]//временный массив
  let next_mess
  if(data!==null){//если есть массив ответов, т.е. пришло от запроса
    let temp2 = []
    if(message.mode===-1){//режим теста
    temp2=data.post.answers.map((answer,index)=>{  //заносим ответы на вопрос
    let ans={type:'bot',text:answer.text,
    SecondText:answer.SecondText,Link:answer.Link, Next_Quest:answer.Next_Quest,FinalAnswer:answer.FinalAnswer,mode:message.mode}
    return ans
  })
  temp2=temp2.reverse()//переворачиваем массив ответов, чтобы вставить в начале вопрос
  //заносим сам вопрос
  temp2.push({type:'bot',text:data.post.quest.text,typeMess:'final',
  SecondText:'',Link:'',Next_Quest:null,FinalAnswer:'',mode:message.mode})
  }
  else{//если не тест
  //Формируем сообщения для кнопки далее
  next_mess={type:'bot',text:'Далее',
  SecondText:'',Link:'',Next_Quest:data.post.items.Next_Quest,FinalAnswer:data.post.items.FinalAnswer,mode:message.mode}

  if((message.mode===-5)&&(q_id!==-1)){temp2.push(next_mess)}//если это режим договора
  //Заносим сообщение
  temp2.push({type:'bot',text:data.post.items.text,
  SecondText:data.post.items.SecondText,typeMess:'final',
  Link:data.post.items.Link,Next_Quest:data.post.items.Next_Quest,FinalAnswer:data.post.items.FinalAnswer,mode:message.mode})
}

  if((message.mode===-1)&&(q_id===1)){temp2.push(test_first_message)}//Вывод приветственного сообщения теста

  temp3=temp2
}

  if(q_id===0){let temp4=Object.assign([],themes)
    temp4.reverse()
    temp3.push(...temp4)}//Вывод меню выбора режимов

if((message.mode===-5)&&(q_id===-1)){//Вывод меню выбора документов
    let temp4=Object.assign([],docs_type)
    temp4.reverse()
    temp3.push(...temp4)
    temp3.push(docs_first)
  }
  if(message!==null){//Вывод выбора пользователя и финального ответа
    if(message.FinalAnswer!==''){
      let ans
      if(message.Next_Quest===null){
      let temp4=Object.assign([],themes)
      temp4.reverse()
      temp3.push(...temp4)
      //Промежуточное сообщение
      ans={type:'bot',typeMess:'final',text:'Может Вы хотите узнать что-нибудь еще?',
      SecondText:'',Link:message.Link,Next_Quest:null,FinalAnswer:'',mode:0}
      temp3.push(ans)}

      if(message.mode===-5){//Вывод выпадающего списка
      ans={type:'bot',typeMess:'final',text:'Возможно, Вас заинтересуют эти вопросы:',
      SecondText:'',Link:message.Link,Next_Quest:null,FinalAnswer:'',mode:'faq'}
      temp3.push(ans)
      }

      if(message.FinalAnswer!=='END'){//Вывод финального ответа
      ans={type:'bot',typeMess:'last',text:message.FinalAnswer,
      SecondText:'',Link:message.Link,Next_Quest:null,FinalAnswer:'',mode:message.mode}
      temp3.push(ans)}
    }
    //Для вывода пользовательских сообщений
    let ans={type:'',text:message.text,
    SecondText:'',Link:'',Next_Quest:null,FinalAnswer:'' ,mode:message.mode,typeMess:message.typeMess}
    if(q_id===0){ans.type='bot'}//Для вывода константных сообщений
    temp3.push(ans)
  }
  temp3=temp3.reverse()
  setMessage([...messages,...temp3])
}

//Всплывающее окно
const popover = (message)=>(
  <Popover style={{maxWidth:'60vh'}}>
    <Popover.Body style={{textAlign:'justify'}}>
        {getFormatedText(message.SecondText,message)}
    </Popover.Body>
  </Popover>
);

//Вывод сообщений
const outMessage = messages.map((message,index)=>{ 

 //Кнопка примечаний 
const cnopcka = ((message.type ==='bot')&&(message.SecondText!=='')) 
? <OverlayTrigger trigger="click" placement="right" overlay={popover(message)}>
  <Button key={index} style={{borderRadius:10,border:'1px solid #a09eff'}} className="d-flex align-items-center" size="sm">
    i</Button> 
</OverlayTrigger>: null

//Выпадающий список
const FAQ = (message.mode==='faq') ?
<Accordion alwaysOpen>
<Accordion.Item eventKey='1'>
      <Accordion.Header style={{textAlign:'justify'}}>{'Чеки'}</Accordion.Header>
      <Accordion.Body style={{backgroundColor: '#F5DEB3'}}>{tromp[0]}</Accordion.Body>
</Accordion.Item>
<Accordion.Item eventKey='2'>
      <Accordion.Header style={{textAlign:'justify'}}>{'Договоры'}</Accordion.Header>
      <Accordion.Body style={{backgroundColor: '#F5DEB3'}}>{tromp[1]}</Accordion.Body>
</Accordion.Item>
<Accordion.Item eventKey='3'>
      <Accordion.Header style={{textAlign:'justify'}}>{'Требования к деятельности'}</Accordion.Header>
      <Accordion.Body style={{backgroundColor: '#F5DEB3'}}>{tromp[2]}</Accordion.Body>
</Accordion.Item>
</Accordion>
: null
//Сообщения
const mess= ((message.typeMess==='last')||(message.typeMess==='final') || (message.type !=='bot')) ?
<div className="d-flex" style={{ marginLeft:message.type ==='bot' ? 0 : 'auto' ,
width:'fit-content',maxWidth:'60vh', border: message.type ==='bot' ? '1px solid #a09eff' : '1px solid #ffabab',textAlign:'justify',
backgroundColor:message.typeMess==='last' ? 'pink' :'#fff', color:'#000', borderRadius:10}}>
    <div style={{marginLeft:8,marginRight:8,marginTop:2,marginBottom:2}}>{getFormatedText(message.text,message)}</div>
</div>
://Кнопки управления
<Button size="sm" onClick={()=>{fetchs(message.Next_Quest,message)}} href= {message.mode===-2 ? FAQ_REG_ROUTE :
(message.mode===-3 ? FAQ_RESP_ROUTE : (message.mode===-4 ? FAQ_PRIV_ROUTE : null))}
style={{ marginLeft: 0, borderRadius:10, width:'fit-content',maxWidth:'60vh', 
border: '1px solid #a09eff',textAlign:'justify'}}>
    {getFormatedText(message.text,message)}
</Button>

return <Grid style={{marginTop:10,marginBottom:5}}  container className="d-flex align-items-center">
            {mess}
            <div style={{marginLeft:5}} className="d-flex align-items-center">
              {cnopcka}
              {FAQ}
            </div>
        </Grid>
})

//Сама страница
const element = error ? Error_page(error) : (isLoaderVisible ? <Loader/> 
:
<Container  className="d-flex flex-column align-items-center">
  <Container  className="d-flex flex-column" id="div1" style={{maxWidth:'160vh',minWidth:'40vh',
   height:window.innerHeight-20,border:'1px solid #3ab2d6', overflowY:'auto', overflowX:'auto' ,borderRadius:10}}>
    {outMessage}
  </Container>
  <h3  className="d-flex" style={{fontSize:'70%',color:'grey',marginBottom:20,textAlign:'justify'}} >
  Все материалы сайта имеют справочно-информационный характер и представлены для ознакомления и анализа. Мы не несем ответственность за действия пользователей</h3>
</Container>           
)

  return (
    <Container className="d-flex justify-content-center align-items-center">
            {element}
    </Container> 
  );
};

export default Chat;