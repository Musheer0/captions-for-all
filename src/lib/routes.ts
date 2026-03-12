import { ClipIcon, ClosedCaptionIcon, CodeIcon, MetaIcon, PlusSignIcon, TranslateIcon, UserIcon } from "@hugeicons/core-free-icons";
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
        name:"Captions",
        icon:ClosedCaptionIcon,
        routes:[
            {
                name:"Translate Captions",
                icon:TranslateIcon,
                route:'/translate-captions'
            },
            {
                name:"Add Captions To Video",
                icon:PlusSignIcon,
                route:'/add-captions'
            },
        ],
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
            {
                name:"Metadata",
                icon:MetaIcon,
                route:'/video-metadata'
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