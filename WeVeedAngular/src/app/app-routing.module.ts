import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { RegisterComponent } from './components/account/register/register.component';
import { PoliciesComponent } from './components/policies/policies.component';
import { MainComponent } from './components/layout/main/main.component';
import { VideoComponent } from './components/home/video/video.component';
import { SimpleLayoutComponent } from './components/layout/simple-layout/simple-layout.component';
import { LoginComponent } from './components/account/login/login.component';
import { UnauthorizedComponent } from './components/reusable/unauthorized/unauthorized.component';
import { CreateSeriesComponent } from './components/pages/create-series/create-series.component';
import { NotAccessableComponent } from './components/reusable/not-accessable/not-accessable.component';
import { EnsureIsProducerGuard } from './guards/EnsureIsProducerGuard';
import { ChannelsTabComponent } from './components/home/menu-tabs/channels-tab/channels-tab.component';
import { SearchTabComponent } from './components/home/menu-tabs/search-tab/search-tab.component';
import { AccountTabComponent } from './components/home/menu-tabs/account-tab/account-tab.component';
import { CommentsTabComponent } from './components/home/menu-tabs/comments-tab/comments-tab.component';
import { PlaynowTabComponent } from './components/home/menu-tabs/playnow-tab/playnow-tab.component';
import { MyAccountWrapperComponent } from './components/account/my-account-wrapper/my-account-wrapper.component';
import { AddVideoComponent } from './components/pages/add-video/add-video.component';
import { NotFoundComponent } from './components/reusable/not-found/not-found.component';
import { ViewSeriesComponent } from './components/series/view-series/view-series.component';
import { SliderNotFoundComponent } from './components/reusable/slider-not-found/slider-not-found.component';
import { SliderErrorComponent } from './components/reusable/slider-error/slider-error.component';
import { UpdateSeriesComponent } from './components/pages/update-series/update-series.component';
import { DeleteSeriesComponent } from './components/pages/delete-series/delete-series.component';
import { UpdateVideoComponent } from './components/pages/update-video/update-video.component';
import { DeleteVideoComponent } from './components/pages/delete-video/delete-video.component';
import { ViewProducerComponent } from './components/pages/view-producer/view-producer.component';
import { ActivationPageComponent } from './components/reusable/activation-page/activation-page.component';
import { AboutUssComponent } from './components/about-uss/about-uss.component';
import { ResetPasswordComponent } from './components/reusable/reset-password/reset-password.component';
import { ChannelCompleteEpListComponent } from './components/home/menu-tabs/channel-complete-ep-list/channel-complete-ep-list.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'general',
        pathMatch: 'full'
    },
    {
        path: '',
        component: SimpleLayoutComponent,
        children: [
            // {
            //     path: 'register',
            //     component: RegisterComponent
            // },
            // {
            //     path: 'login',
            //     component: LoginComponent
            // },
            {
                path: 'actx/:tx',
                component: ActivationPageComponent
            },
            {
                path: 'actx',
                component: ActivationPageComponent
            },
            {
                path: 'policies',
                component: PoliciesComponent
            },
            {
                path: 'rstpwd/:token',
                component: ResetPasswordComponent
            },
            {
                path: 'rstpwd',
                component: ResetPasswordComponent
            },
            // {
            //     path: 'unauthorized',
            //     component: UnauthorizedComponent
            // },
            // {
            //     path: 'not-accessable',
            //     component: NotAccessableComponent
            // },
            // {
            //     path: 'not-found',
            //     component: NotFoundComponent
            // },
            // {
            //     path: 'create-series',
            //     component: CreateSeriesComponent,
            //     canActivate: [ EnsureIsProducerGuard ]
            // }
        ]
    },
    {
        path: ':playing',
        component: MainComponent,
        children: [
            {
                path: '',
                redirectTo: 'channels',
                pathMatch: 'full'
            },

            // common pages 
            {
                path: 'about-us',
                component: AboutUssComponent
            },
            {
                path: 'terms-and-conditions',
                component: PoliciesComponent
            },
            {
                path: 'not-found',
                component: SliderNotFoundComponent
            },
            {
                path: 'error',
                component: SliderErrorComponent
            },

            {
                path: 'producer/:id',
                component: ViewProducerComponent
            },
            {
                path: 'producer',
                component: ViewProducerComponent
            },

            {
                path: 'series/:id',
                component: ViewSeriesComponent
            },
            {
                path: 'series',
                component: ViewSeriesComponent
            },

            {
                path: 'channel-program/:channel',
                component: ChannelCompleteEpListComponent
            },
            {
                path: 'channel-program',
                component: ChannelCompleteEpListComponent
            },

            {
                path: 'channels',
                component: ChannelsTabComponent
            },
            {
                path: 'search',
                component: SearchTabComponent
            },
            {
                path: 'account',
                component: AccountTabComponent,
                children: [
                    {
                        path: '',
                        component: MyAccountWrapperComponent
                    },
                    {
                        path: 'create-series',
                        component: CreateSeriesComponent,
                        canActivate: [ EnsureIsProducerGuard ]
                    },
                    {
                        path: 'update-series/:id',
                        component: UpdateSeriesComponent,
                        canActivate: [ EnsureIsProducerGuard ]
                    },
                    {
                        path: 'update-series',
                        component: UpdateSeriesComponent,
                        canActivate: [ EnsureIsProducerGuard ]
                    },
                    {
                        path: 'delete-series/:id',
                        component: DeleteSeriesComponent,
                        canActivate: [ EnsureIsProducerGuard ]
                    },
                    {
                        path: 'delete-series/',
                        component: DeleteSeriesComponent,
                        canActivate: [ EnsureIsProducerGuard ]
                    },
                    {
                        path: 'add-video/:seriesid',
                        component: AddVideoComponent,
                        canActivate: [ EnsureIsProducerGuard ]
                    },
                    {
                        path: 'add-video',
                        component: AddVideoComponent,
                        canActivate: [ EnsureIsProducerGuard ]
                    },
                    {
                        path: 'update-video/:id',
                        component: UpdateVideoComponent,
                        canActivate: [ EnsureIsProducerGuard ]
                    },
                    {
                        path: 'update-video',
                        component: UpdateVideoComponent,
                        canActivate: [ EnsureIsProducerGuard ]
                    },
                    {
                        path: 'delete-video/:id',
                        component: DeleteVideoComponent,
                        canActivate: [ EnsureIsProducerGuard ]
                    },
                    {
                        path: 'delete-video/',
                        component: DeleteVideoComponent,
                        canActivate: [ EnsureIsProducerGuard ]
                    },
                ]
            },
            {
                path: 'comments',
                component: CommentsTabComponent
            },
            {
                path: 'playnow',
                component: PlaynowTabComponent
            }
        ]
    },
    
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    // preload all modules; optionally we could
    // implement a custom preloading strategy for just some
    // of the modules (PRs welcome 😉)
    preloadingStrategy: PreloadAllModules
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
