import {
    trigger,
    transition,
    style,
    query,
    group,
    animateChild,
    animate,
    keyframes,
  } from '@angular/animations';


// Basic

export const fader =
  trigger('routeAnimations', [
    transition('Perfil <=> Inicio', [
      query(':enter, :leave', [
        style({
          position: 'absolute',
          left: 0,
          width: '100%',
          opacity: 0,
          transform: 'scale(0) translateY(100%)',
        }),
      ]),
      query(':enter', [
        animate('600ms ease', style({ opacity: 1, transform: 'scale(1) translateY(0)' })),
      ])
    ]),
]);


// Positioned

export const myAnimations =
  trigger('routeAnimations', [
    transition('SolicitarTurno => Inicio', slideTo('left') ),
    transition('SolicitarTurno => MisTurnos', slideTo('left') ),
    transition('MisTurnos => Inicio', slideTo('left') ),
    transition('Inicio => SolicitarTurno', slideTo('right')),
    transition('Inicio => MisTurnos', slideTo('right')),
    transition('Inicio => Login', slideTo('right')),
    transition('Inicio => Registro', slideTo('right')),
    transition('Login => Registro', slideTo('right')),
    transition('Login => Inicio', slideTo('left')),
    transition('Registro => Inicio', slideTo('left')),
    transition('Registro => Login', slideTo('left')),
    transition('MisTurnos => SolicitarTurno', slideTo('right')),
    transition('Perfil <=> Inicio', enterAndLeave()),
    transition('Perfil <=> MisTurnos', enterAndLeave()),
    transition('Perfil <=> SolicitarTurno', enterAndLeave()),
    transition('Estadisticas <=> Inicio', enterAndLeave()),
    transition('Estadisticas <=> MisTurnos', enterAndLeave()),
    transition('Estadisticas <=> SolicitarTurno', enterAndLeave()),
    transition('Estadisticas <=> PanelUsuarios', enterAndLeave()),
    transition('PanelUsuarios <=> MisTurnos', enterAndLeave()),
    transition('PanelUsuarios <=> SolicitarTurno', enterAndLeave()),
    transition('PanelUsuarios <=> Inicio', enterAndLeave()),
  ]);


/*export const transformer =
  trigger('routeAnimations', [
    transition('Perfil => Inicio', translateTo({ x: -100, y: -100, rotate: -720 }) ),
]);*/


function enterAndLeave(){
  return [
    query(':enter, :leave', [
      style({
        position: 'absolute',
        left: 0,
        width: '100%',
        opacity: 0,
        transform: 'scale(0) translateY(100%)',
      }),
    ]),
    query(':enter', [
      animate('600ms ease', style({ opacity: 1, transform: 'scale(1) translateY(0)' })),
    ]),
  ]
}

function slideTo(direction:any) {
  const optional = { optional: true };
  return [
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        [direction]: 0,
        width: '100%'
      })
    ], optional),
    query(':enter', [
      style({ [direction]: '-100%'})
    ]),
    group([
      query(':leave', [
        animate('600ms ease', style({ [direction]: '100%'}))
      ], optional),
      query(':enter', [
        animate('600ms ease', style({ [direction]: '0%'}))
      ])
    ]),
    //Normalize the page style... Might not be necessary

    //Required only if you have child animations on the page
     query(':leave', animateChild()),
    query(':enter', animateChild()),
  ];
}


/*function translateTo({x = 100, y = 0, rotate = 0}) {
  const optional = { optional: true };
  return [
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%'
      })
    ], optional),
    query(':enter', [
      style({ transform: `translate(${x}%, ${y}%) rotate(${rotate}deg)`})
    ]),
    group([
      query(':leave', [
        animate('600ms ease-out', style({ transform: `translate(${x}%, ${y}%) rotate(${rotate}deg)`}))
      ], optional),
      query(':enter', [
        animate('600ms ease-out', style({ transform: `translate(0, 0) rotate(0)`}))
      ])
    ]),
  ];
}*/


// Keyframes

/*export const stepper =
  trigger('routeAnimations', [
    transition('Inicio <=> Perfil', [
      query(':enter, :leave', [
        style({
          position: 'absolute',
          left: 0,
          width: '100%',
        }),
      ]),
      group([
        query(':enter', [
          animate('2000ms ease', keyframes([
            style({ transform: 'scale(0) translateX(100%)', offset: 0 }),
            style({ transform: 'scale(0.5) translateX(25%)', offset: 0.3 }),
            style({ transform: 'scale(1) translateX(0%)', offset: 1 }),
          ])),
        ]),
        query(':leave', [
          animate('2000ms ease', keyframes([
            style({ transform: 'scale(1)', offset: 0 }),
            style({ transform: 'scale(0.5) translateX(-25%) rotate(0)', offset: 0.35 }),
            style({ opacity: 0, transform: 'translateX(-50%) rotate(-180deg) scale(6)', offset: 1 }),
          ])),
        ])
      ]),
    ])

]);*/