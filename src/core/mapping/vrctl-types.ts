// Pure data the P5 vrc.tl DOM parser produces from a detail page. The mappers
// (to-vrctl/from-vrctl) consume this; they never touch the DOM. Option ids +
// labels are scraped at runtime — never hardcode them.

export interface VrctlOption {
  id: string;
  label: string;
}

export type VrctlFlagKind = 'radio' | 'checkbox' | 'multi';

export interface VrctlFlagCategory {
  key: string; // '1'..'6' (flags[<key>])
  name: string; // e.g. 'NSFW / SFW', 'Platform'
  kind: VrctlFlagKind;
  options: VrctlOption[]; // ({id:'',label:'(no tag)'} allowed for optional radios)
}

export interface VrctlSlotForm {
  id: string; // server-assigned slot id (slots[<id>][...])
  duration?: number; // minutes
  flag?: string; // slot flag select value (e.g. 'performers')
  performers: VrctlOption[]; // resolved performer id+label (free-text ids allowed)
  publicNote?: string;
  privateNote?: string;
}

export interface VrctlDetailForm {
  actionUrl: string; // form action (POST target)
  doValue: string; // '_do' value, observed 'form-form-submit'
  organizerOptions: VrctlOption[];
  selectedOrganizerIds: string[];
  timezoneOptions: string[];
  howToJoinOptions: VrctlOption[]; // e.g. {id:'group-<orgId>', label:'<club>'}
  selectedHowToJoin?: string;
  flagCategories: Record<string, VrctlFlagCategory>; // key '1'..'6'
  selectedFlags: Record<string, string[]>; // category key -> selected option ids
  slots: VrctlSlotForm[];
  current: {
    name?: string;
    description?: string;
    start?: string; // datetime-local 'YYYY-MM-DDTHH:MM'
    timezone?: string;
    url?: string;
    instanceOpenMinutesBeforeStart?: number;
    showSlots?: boolean;
    published?: boolean;
    posterType?: string; // 'url' | 'upload'
    posterUrl?: string;
  };
}
