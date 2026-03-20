import { ClipIcon, ClosedCaptionIcon, CodeIcon, MetaIcon, PlusSignIcon, TranslateIcon, UserIcon, VideoIcon } from "@hugeicons/core-free-icons";
type IconSvgObject = ([string, {
    [key: string]: string | number;
}])[] | readonly (readonly [string, {
    readonly [key: string]: string | number;
}])[];
type routes =   { name: string;
    icon: IconSvgObject;
    routes: {
        name: string;
        icon: IconSvgObject;
        route: string;
    }[];

}
export const routes = [
    {
        name:"General",
        routes:[
              {
                name:"Your Videos",
                icon:VideoIcon,
                route:'/videos'
            },
               {
                name:"Add Captions To Video",
                icon:PlusSignIcon,
                route:'/add-captions'
            },
               {
                name:"Generations",
                icon:VideoIcon,
                route:'/generations'
            },
        ]
    },
       {
        name:"For Creators",
        icon:UserIcon,
        routes:[
            {
                name:"Clipper",
                icon:ClipIcon,
                route:'/clipper'
            },
        ],
    },
    {
        name:"Scripts",
        icon:CodeIcon,
        routes:[{
              name:"Scripts",
        icon:CodeIcon,
        route: '/scripts',
        }]
    }
]