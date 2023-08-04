import {Component, ElementRef, Input, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ApiService} from "../api.service";
import {  firstValueFrom, fromEvent} from "rxjs";


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  @Input()username!:string;
  @Input() message: string = '';
  messages: Message[] = [];
  messagesFetchInterval?: number;
  users: Users[]=[];
  sentMessage = false;


  @ViewChild('messagesContainer', { static: true }) messagesContainer!: ElementRef;
  @ViewChild('logoutBtn', { static: true }) logoutBtn!: ElementRef;
  @ViewChild('usersBtn', { static: true }) usersBtn!: ElementRef;
  @ViewChild('template') template!: TemplateRef<any>;


  constructor(private router: Router, private route: ActivatedRoute,
              private apiService: ApiService) {
    this.username = String(this.route.snapshot.paramMap.get('username'));

  }

  ngOnInit(){
    window.addEventListener('beforeunload', () => {
      this.apiService.logout();
    });


    this.messagesFetchInterval = setInterval(()=>
    {
      firstValueFrom(this.apiService.getMessages())
        .then( (data)=> {
          if(JSON.stringify(this.messages) !== JSON.stringify(data)){
          this.messages = data;
        }
        })
        .catch((error) => console.error(error));
    },1000);

    fromEvent(this.logoutBtn.nativeElement,'click')
      .subscribe(
        ()=>{
          firstValueFrom(this.apiService.logout())
            .then(  () => {
              clearInterval(this.messagesFetchInterval);
              this.apiService.token='';
              this.router.navigate(['/login']).then();
            })
            .catch((error) => console.error(error));
        }
     );

    fromEvent(this.usersBtn.nativeElement,'click').subscribe(()=>{
      firstValueFrom(this.apiService.getUsers())
        .then( (data) => {
          this.users = data;
        })
        .catch((error) => console.error(error));
    });
    this.usersBtn.nativeElement.dispatchEvent(new Event('click'));
  }

  sendMessage(){
    if (this.message == '' || this.sentMessage) return;
    this.sentMessage = true;
    this.messages.push({ message: this.message, username: this.username, created_at: Date.now()});
    firstValueFrom(this.apiService.postMessage(this.message))
      .then(() => {
        this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
      })
      .catch((error) => console.error(error));

    this.message = '';
    this.sentMessage = false;
  }

  ngOnDestroy(){
    firstValueFrom(this.apiService.logout())
      .then()
      .catch((error) => console.error(error));
    clearInterval(this.messagesFetchInterval);
    this.router.navigate(['/login']).then();
  }

  setDateTime(dateTime:number) {
    const date = new Date(dateTime * 1000)
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const formattedDate = `${hours}:${minutes}`;

    return formattedDate ;
  }
}

interface Message{
  message: string;

  username: string;

  created_at: number;
}


interface Users {
  username: string;
}
