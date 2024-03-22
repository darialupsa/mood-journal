import {
  trigger,
  animate,
  transition,
  style,
  query,
  state,
  keyframes,
  group,
  AnimationTriggerMetadata,
} from '@angular/animations';

export const fadeAnimation = trigger('fadeAnimation', [
  transition('* => *', [
    query(':enter', [style({ opacity: 0 })], { optional: true }),
    // query(
    //     ':leave',
    //     [style({ opacity: 1 }), animate('0.1s', style({ opacity: 0 }))],
    //     { optional: true }
    // ),
    query(
      ':enter',
      [style({ opacity: 0 }), animate('0.3s', style({ opacity: 1 }))],
      {
        optional: true,
      }
    ),
  ]),
]);

export const FadeInOutAnimation = [
  trigger('fadeInOutAnimation', [
    state(
      'false',
      style({
        opacity: 0,
      })
    ),
    state(
      'true',
      style({
        opacity: 1,
      })
    ),
    transition('true => false', animate('0s ease-out')),
    transition('false => true', animate('0.5s ease-in')),
  ]),
];

export const EaseInOutAnimation = trigger('easeInOutAnimation', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('0.5s ease-in', style({ opacity: 0.3 })),
  ]),
  transition(':leave', [
    style({ opacity: 0.3 }),
    animate('0s ease-out', style({ opacity: 0 })),
  ]),
]);

export const FadingAnimation = [
  trigger('fadingAnimation', [
    transition('* => *', [
      style({ opacity: 0 }),
      animate('0.6s ease-in', style({ opacity: 1 })),
    ]),
  ]),
];

export const Anim1 = [
  trigger('anim1', [
    transition('void => *', [
      animate(
        '2s',
        keyframes([
          style({
            color: 'transparent',
            opacity: 0,
            offset: 0,
          }),
          style({
            color: 'transparent',
            opacity: 0,
            offset: 0.6,
          }),
          style({ opacity: 1, color: '*', offset: 1 }),
        ])
      ),
    ]),
    transition('* => void', [
      animate('4s ease-out', style({ transform: 'scale(1.3)', opacity: 0 })),
    ]),
  ]),
];

//animatie imagine
export const Anim2 = [
  trigger('anim2', [
    transition('void => *', [animate('0.5s ease-in', style({ opacity: 0.3 }))]),
    transition('* => void', [animate('3s ease-out', style({ opacity: 0.1 }))]),
  ]),
];

export const ChangeBackgroundAnimation = [
  trigger('changeBackgroundAnimation', [
    state(
      '0',
      style({
        opacity: 0,
      })
    ),
    state(
      '1',
      style({
        opacity: 1,
      })
    ),
    transition('1 => 0', [
      style({ opacity: 0 }),
      animate('0.5s', style({ opacity: 0 })),
    ]),

    transition('0 => 1', [
      style({ opacity: 0 }),
      animate(
        '1s',
        keyframes([
          style({
            opacity: 0.5,
            offset: 0.5,
          }),
          style({ opacity: 1, offset: 1 }),
        ])
      ),
    ]),
  ]),
];

export const EaseInAnimation = [
  trigger('easeInAnimation', [
    transition('void=> *', []),
    transition('false => true', [
      style({ opacity: 0 }),
      animate('0.6s ease-in', style({ opacity: 1 })),
    ]),
    transition('true => false', []),
  ]),
];

export function ChangeStateAnimation(
  duration = '0.6s'
): AnimationTriggerMetadata {
  return trigger('changeStateAnimation', [
    transition('void=> *', []),
    transition('* => *', [
      style({ opacity: 0 }),
      animate(`${duration} ease-in`, style({ opacity: 1 })),
    ]),
  ]);
}

export const ErrorBackgroudAnimation = [
  trigger('errorBackgroudAnimation', [
    transition('void => *', []),
    transition('* => *', [
      query(
        ' .mat-form-field-outline',
        [
          style({ 'background-color': '#f3000008' }),
          animate(
            '3s',
            keyframes([
              style({ 'background-color': '#f3000010', offset: 0.2 }),
              style({ 'background-color': 'unset', offset: 1 }),
            ])
          ),
        ],
        { optional: true }
      ),
    ]),
  ]),
];

// set 'transform-origin: top' for target element
export const InOutScaleAnimation = trigger('inOutScaleAnimation', [
  transition(':enter', [
    style({ opacity: 0, height: '0px', transform: ' scaleY(0.8)' }),
    animate(
      '0.5s ease-in',
      keyframes([
        style({
          opacity: 0.1,
          height: '*',
          transform: ' scaleY(1)',
          offset: 0.5,
        }),
        style({ opacity: 0.3, offset: 1 }),
      ])
    ),
  ]),
  transition(':leave', [
    style({ opacity: 1, height: '*', transform: ' scaleY(1)' }),

    animate(
      '0.5s ease-out',
      keyframes([
        style({ opacity: 0, offset: 0.1 }),
        style({ height: '0', transform: ' scaleY(0)', offset: 1 }),
      ])
    ),
  ]),
]);

export const InOutAnimation = trigger('inOutAnimation', [
  transition(':enter', [
    style({ opacity: 0, height: '0px' }),
    animate('1s ease-in', style({ opacity: 1, height: '*' })),
  ]),
  transition(':leave', [
    style({ opacity: 1, height: '*' }),
    animate('1s ease-out', style({ opacity: 0, height: '0px' })),
  ]),
]);

export const AddRowAnimation = trigger('addRowAnimation', [
  transition('void => false', []),
  transition(
    ':enter',
    group([
      style({ height: '0px', transform: ' scaleY(0.3)' }),
      animate(
        '0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        style({
          height: '*',
          transform: ' scaleY(1)',
        })
      ),
      animate(
        '3s',
        keyframes([
          style({ backgroundColor: '#f4f4f4', offset: 0.1 }),
          style({ backgroundColor: 'initial', offset: 1 }),
        ])
      ),
    ])
  ),
]);

export const RemoveRowAnimation = trigger('removeRowAnimation', [
  transition('false => void', []),
  transition(':leave', [
    style({ height: '*', transform: ' scaleY(1)' }),
    group([
      animate(
        '0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        style({
          height: '0',
          transform: ' scaleY(0)',
        })
      ),
    ]),
  ]),
]);

export const RemoveTreeRowAnimation = trigger('removeTreeRowAnimation', [
  transition('true => false', [
    group([
      animate(
        '0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        keyframes([
          style({ height: '*', offset: 0 }),
          style({ height: '*', offset: 0.1 }),
          style({ height: 0, transform: ' scaleY(0)', offset: 1 }),
        ])
      ),
    ]),
  ]),
]);

export const VerticalSlideAnimation = trigger('verticalSlideAnimation', [
  state(
    'hide',
    style({
      height: 0,
    })
  ),
  state(
    'show',
    style({
      height: '*',
    })
  ),
  transition('void => hide', []),
  transition('hide => show', [
    animate('600ms cubic-bezier(0.25, 0.8, 0.25, 1)'),
  ]),
  transition('show => hide', [animate('200ms ease-out')]),
]);
