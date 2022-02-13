import { NgtUniversalModule } from '@ng-toolkit/universal';
import { CommonModule } from '@angular/common';
import { TransferHttpCacheModule } from '@nguniversal/common';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/layout/navbar/navbar.component';
import { PlayerComponent } from './components/player/player.component';
import { MainComponent } from './components/layout/main/main.component';
import { RegisterComponent } from './components/account/register/register.component';
import { AppRoutingModule } from './app-routing.module';
import { VideoComponent } from './components/home/video/video.component';
import { SimpleLayoutComponent } from './components/layout/simple-layout/simple-layout.component';
import { LoginComponent } from './components/account/login/login.component';
import { MenuComponent } from './components/home/menu/menu.component';
import { ChannelsTabComponent } from './components/home/menu-tabs/channels-tab/channels-tab.component';
import { CommentsTabComponent } from './components/home/menu-tabs/comments-tab/comments-tab.component';
import { PlaynowTabComponent } from './components/home/menu-tabs/playnow-tab/playnow-tab.component';
import { SearchTabComponent } from './components/home/menu-tabs/search-tab/search-tab.component';
import { AccountTabComponent } from './components/home/menu-tabs/account-tab/account-tab.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatButtonModule, MatCheckboxModule, MatExpansionModule, MatSelectModule, MatProgressBarModule, MatDialogModule, MatMenuModule,
  MatInputModule, MatProgressSpinnerModule, MatSnackBarModule, MatIconModule, MatTooltipModule, MatTabsModule } from '@angular/material';

import { ActionButtonComponent } from './components/reusable/action-button/action-button.component';
import { PoliciesComponent } from './components/policies/policies.component';
import { PlaynowInformationComponent } from './components/home/playnow-tab-components/playnow-information/playnow-information.component';

import { LaddaModule } from 'angular2-ladda';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

// Font awesome
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUsers, faSignInAlt, faUser, faFileContract, faSignOutAlt, faPlus, faEye, faExclamation, faHeart, faEdit, faPause, faInfoCircle, faArrowUp, faEllipsisV,
  faPhone, faVideo, faPlayCircle, faComments, faComment, faTh, faSearch, faCloudUploadAlt, faPlay, faTrash, faStepForward, faStepBackward, faTimes, faSortDown, faUniversity,
  faUserCircle, faCheckCircle, faExclamationCircle, faAngleRight, faAngleLeft, faCamera, faChevronLeft, faTimesCircle, faTv, faBookOpen, faPlaneDeparture, faCar,
  faBasketballBall, faLaptop, faTshirt, faHeadset, faChild, faUtensils, faMusic } from '@fortawesome/free-solid-svg-icons';

import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons';
import { faSmile, faNewspaper } from '@fortawesome/free-regular-svg-icons';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { UnauthorizedComponent } from './components/reusable/unauthorized/unauthorized.component';
import { NotificationContentComponent } from './components/reusable/notification-content/notification-content.component';
import { CommentsTabCommentComponent } from './components/home/comments-tab-comment/comments-tab-comment.component';
import { MyAccountComponent } from './components/account/my-account/my-account.component';
library.add(faSignInAlt, faUser, faFileContract, faSignOutAlt, faCheckCircle, faExclamationCircle, faCamera, faChevronLeft, faTimesCircle, faEye, faCloudUploadAlt,
  faHeart, farHeart, faPlay, faTrash, faEdit, faStepForward, faStepBackward, faPause, faTimes, faComment, faInfoCircle, faArrowUp, faEllipsisV, faSortDown, faBookOpen,
  faPhone, faVideo, faUsers, faPlayCircle, faComments, faTh, faSearch, faUserCircle, faAngleRight, faAngleLeft, faPlus, faExclamation, faTv, faSmile, faNewspaper,
  faUniversity, faPlaneDeparture, faCar, faBasketballBall, faLaptop, faTshirt, faHeadset, faChild, faUtensils, faMusic);

import { ImageCropperModule } from 'ngx-image-cropper';
import { MyAccountProducerComponent } from './components/account/my-account-producer/my-account-producer.component';
import { MyProductionsComponent } from './components/account/my-productions/my-productions.component';
import { CreateSeriesComponent } from './components/pages/create-series/create-series.component';
import { NotAccessableComponent } from './components/reusable/not-accessable/not-accessable.component';
// import { EnsureIsProducerGuard } from './guards/EnsureIsProducerGuard';
import { EnsureIsProducerGuard } from '../app/guards/EnsureIsProducerGuard';
import { LoadingBlocksProfileComponent } from './components/reusable/loading-blocks-profile/loading-blocks-profile.component';
import { MyAccountWrapperComponent } from './components/account/my-account-wrapper/my-account-wrapper.component';
import { ImagesSliderComponent } from './components/reusable/images-slider/images-slider.component';
import { LoadingBlocksSliderComponent } from './components/reusable/loading-blocks-slider/loading-blocks-slider.component';

import { NgxLinkifyjsModule } from 'ngx-linkifyjs';
import { AddVideoComponent } from './components/pages/add-video/add-video.component';
import { FileDropModule } from 'ngx-file-drop';
import { NotFoundComponent } from './components/reusable/not-found/not-found.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { VideoPaginatorComponent } from './components/reusable/video-paginator/video-paginator.component';
import { LoadingBlocksPaginatorComponent } from './components/reusable/loading-blocks-paginator/loading-blocks-paginator.component';
import { ViewSeriesComponent } from './components/series/view-series/view-series.component';
import { SliderNotFoundComponent } from './components/reusable/slider-not-found/slider-not-found.component';
import { SliderErrorComponent } from './components/reusable/slider-error/slider-error.component';
import { LoadingBlocksSeriesComponent } from './components/reusable/loading-blocks-series/loading-blocks-series.component';
import { LoadingBlockSliderSeriesComponent } from './components/reusable/loading-block-slider-series/loading-block-slider-series.component';
import { UpdateSeriesComponent } from './components/pages/update-series/update-series.component';
import { DeleteSeriesComponent } from './components/pages/delete-series/delete-series.component';
import { LoadingBlocksSeriesHeaderComponent } from './components/reusable/loading-blocks-series-header/loading-blocks-series-header.component';
import { LoadingBlocksSeriesUpdateComponent } from './components/reusable/loading-blocks-series-update/loading-blocks-series-update.component';
import { LoadingBlocksConfirmTextComponent } from './components/reusable/loading-blocks-confirm-text/loading-blocks-confirm-text.component';
import { VideoElementComponent } from './components/reusable/video-element/video-element.component';
import { DeleteVideoComponent } from './components/pages/delete-video/delete-video.component';
import { UpdateVideoComponent } from './components/pages/update-video/update-video.component';
import { WatchComponent } from './components/home/watch/watch.component';
import { ChannelComponent } from './components/home/channel/channel.component';
import { Constants } from './constants/Constants';
import { ProducerSliderComponent } from './components/producer-slider/producer-slider.component';
import { LoadingBlocksSearchProducersComponent } from './components/loading-blocks-search-producers/loading-blocks-search-producers.component';
import { ViewProducerComponent } from './components/pages/view-producer/view-producer.component';
import { LoadingBlocksProducerHeaderComponent } from './components/reusable/loading-blocks-producer-header/loading-blocks-producer-header.component';
import { MyFollowingsComponent } from './components/account/my-followings/my-followings.component';
import { LoadingBlocksMyFollowingsComponent } from './components/reusable/loading-blocks-my-followings/loading-blocks-my-followings.component';
import { PlayNowMainElementComponent } from './components/reusable/play-now-main-element/play-now-main-element.component';
import { LoadingBlocksPlayingNowMainComponent } from './components/reusable/loading-blocks-playing-now-main/loading-blocks-playing-now-main.component';
import { LoadingBlocksPlayingNowNextComponent } from './components/reusable/loading-blocks-playing-now-next/loading-blocks-playing-now-next.component';

import {TimeAgoPipe} from 'time-ago-pipe';
import { LoadingBlocksCommentsComponent } from './components/reusable/loading-blocks-comments/loading-blocks-comments.component';
import { DialogNouserContentComponent } from './components/reusable/dialog-nouser-content/dialog-nouser-content.component';
import { MyChannelComponent } from './components/home/my-channel/my-channel.component';
import { DialogMychannelErrorContentComponent } from './components/reusable/dialog-mychannel-error-content/dialog-mychannel-error-content.component';

import { DeviceDetectorModule } from 'ngx-device-detector';

import { JwtModule } from '@auth0/angular-jwt';

import {
  SocialLoginModule,
  AuthServiceConfig,
  FacebookLoginProvider,
} from "angular-6-social-login-with-first-name-last-name";

// import SocialLoginModule from "angular-6-social-login-with-first-name-last-name/index/";

import { ActivationPageComponent } from './components/reusable/activation-page/activation-page.component';
import { DurationPipe } from './pipes/DurationPipe';
import { TimeAgo } from './pipes/TimeAgoPipe';

import { GtagModule } from 'angular-gtag';
import { AboutUssComponent } from './components/about-uss/about-uss.component';
import { ResetPasswordComponent } from './components/reusable/reset-password/reset-password.component';
import { ResetPasswordSendEmailComponent } from './components/reusable/reset-password-send-email/reset-password-send-email.component';
import { SeriesByCategoriesComponent } from './components/reusable/series-by-categories/series-by-categories.component';
import { EpisodesByCategoriesComponent } from './components/reusable/episodes-by-categories/episodes-by-categories.component';
import { VideoHalfCardComponent } from './components/reusable/video-half-card/video-half-card.component';
import { DialogProducerConditionsComponent } from './components/reusable/dialog-producer-conditions/dialog-producer-conditions.component';
import { ChannelHorListComponent } from './components/home/menu-tabs/channel-hor-list/channel-hor-list.component';
import { ChannelCompleteEpListComponent } from './components/home/menu-tabs/channel-complete-ep-list/channel-complete-ep-list.component';

export function getAuthServiceConfigs() {
  let config = new AuthServiceConfig(
      [
        {
          id: FacebookLoginProvider.PROVIDER_ID,
          provider: new FacebookLoginProvider("1817147274990321")
        }
      ]
  );
  return config;
}

  const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: false,
    wheelSpeed: 0.5
  };

  let providers = {
    "facebook": {
      "clientId": "1817147274990321",
      "apiVersion": "v3.2" //like v2.4
    }
  };

  export function tokenGetter() {
    return localStorage.getItem('access_token');
  }

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    PlayerComponent,
    MainComponent,
    RegisterComponent,
    VideoComponent,
    SimpleLayoutComponent,
    LoginComponent,
    MenuComponent,
    ChannelsTabComponent,
    CommentsTabComponent,
    PlaynowTabComponent,
    SearchTabComponent,
    AccountTabComponent,
    ActionButtonComponent,
    PoliciesComponent,
    PlaynowInformationComponent,
    UnauthorizedComponent,
    NotificationContentComponent,
    CommentsTabCommentComponent,
    MyAccountComponent,
    MyAccountProducerComponent,
    MyProductionsComponent,
    CreateSeriesComponent,
    NotAccessableComponent,
    LoadingBlocksProfileComponent,
    MyAccountWrapperComponent,
    ImagesSliderComponent,
    LoadingBlocksSliderComponent,
    AddVideoComponent,
    NotFoundComponent,
    VideoPaginatorComponent,
    LoadingBlocksPaginatorComponent,
    ViewSeriesComponent,
    SliderNotFoundComponent,
    SliderErrorComponent,
    LoadingBlocksSeriesComponent,
    LoadingBlockSliderSeriesComponent,
    UpdateSeriesComponent,
    DeleteSeriesComponent,
    LoadingBlocksSeriesHeaderComponent,
    LoadingBlocksSeriesUpdateComponent,
    LoadingBlocksConfirmTextComponent,
    VideoElementComponent,
    DeleteVideoComponent,
    UpdateVideoComponent,
    WatchComponent,
    ChannelComponent,
    ProducerSliderComponent,
    LoadingBlocksSearchProducersComponent,
    ViewProducerComponent,
    LoadingBlocksProducerHeaderComponent,
    MyFollowingsComponent,
    LoadingBlocksMyFollowingsComponent,
    PlayNowMainElementComponent,
    LoadingBlocksPlayingNowMainComponent,
    LoadingBlocksPlayingNowNextComponent,
    TimeAgoPipe,
    LoadingBlocksCommentsComponent,
    DialogNouserContentComponent,
    MyChannelComponent,
    DialogMychannelErrorContentComponent,
    ActivationPageComponent,
    DurationPipe,
    TimeAgo,
    AboutUssComponent,
    ResetPasswordComponent,
    ResetPasswordSendEmailComponent,
    SeriesByCategoriesComponent,
    EpisodesByCategoriesComponent,
    VideoHalfCardComponent,
    DialogProducerConditionsComponent,
    ChannelHorListComponent,
    ChannelCompleteEpListComponent
  ],
  imports:[
    CommonModule,
    NgtUniversalModule,
    TransferHttpCacheModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatInputModule,
    FontAwesomeModule,
    HttpModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatIconModule,
    MatTooltipModule,
    MatSelectModule,
    MatProgressBarModule,
    LaddaModule,
    PerfectScrollbarModule,
    ImageCropperModule,
    NgxLinkifyjsModule.forRoot(),
    FileDropModule,
    NgSelectModule,
    MatTabsModule,
    MatDialogModule,
    MatMenuModule,
    SocialLoginModule,
    DeviceDetectorModule.forRoot(),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        // whitelistedDomains: ['example.com'],
        // blacklistedRoutes: ['example.com/examplebadroute/']
      }
    }),
    GtagModule.forRoot({ trackingId: 'UA-121852708-1', trackPageviews: true })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG 
    },
    EnsureIsProducerGuard,
    Constants,
    {
      provide: AuthServiceConfig,
      useFactory: getAuthServiceConfigs
    }
  ],
  entryComponents: [
    NotificationContentComponent,
    DialogNouserContentComponent,
    DialogMychannelErrorContentComponent,
    DialogProducerConditionsComponent
  ]
})
export class AppModule { }