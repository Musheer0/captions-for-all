import { CameraVideoIcon, ClipIcon, ClosedCaptionIcon, CodeIcon, MetaIcon, PlusSignIcon, TranslateIcon, UserIcon, VideoIcon } from "@hugeicons/core-free-icons";
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
                name:"Videos",
                icon:VideoIcon,
                route:'/videos'
            },
               {
                name:"Clips",
                icon:CameraVideoIcon,
                route:'/clips'
            },
               {
                name:"Captioned Videos",
                icon:ClosedCaptionIcon,
                route:'/generations'
            },
        ]
    },
       {
        name:"Studio",
        icon:UserIcon,
        routes:[
            {
                name:"Clip Video",
                icon:ClipIcon,
                route:'/clipper'
            },
                {
                name:"Caption Video",
                icon:ClosedCaptionIcon,
                route:'/add-captions    '
            },
        ],
    },
    {
        name:"Developers",
        icon:CodeIcon,
        routes:[{
              name:"Scripts",
        icon:CodeIcon,
        route: '/scripts',
        }]
    }
]