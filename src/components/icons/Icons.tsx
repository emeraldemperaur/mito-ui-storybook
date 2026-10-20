"use client";

import React, { type ComponentPropsWithoutRef, type JSX } from "react";
import { 
  SunIcon, MoonIcon, GearIcon, PersonIcon, QuestionMarkCircledIcon, 
  QuestionMarkIcon, CheckCircledIcon, CheckIcon, ExitIcon, CalendarIcon, 
  StarIcon, CameraIcon, CodeIcon, CodeSandboxLogoIcon, LayersIcon, InputIcon, 
  MagnifyingGlassIcon, Cross1Icon, Cross2Icon, Crosshair2Icon, GitHubLogoIcon, 
  InstagramLogoIcon, LinkedInLogoIcon, StackIcon, FileIcon, SwitchIcon, HomeIcon, 
  BellIcon, CaretUpIcon, CardStackIcon, CardStackMinusIcon, CardStackPlusIcon, PlusIcon, 
  PlusCircledIcon, MinusIcon, MinusCircledIcon, CaretDownIcon, CaretSortIcon, CaretLeftIcon, 
  CaretRightIcon, TrashIcon, CubeIcon, HeartIcon, BackpackIcon, CircleBackslashIcon, InfoCircledIcon, 
  EnvelopeOpenIcon, EnvelopeClosedIcon, PaperPlaneIcon, LockClosedIcon, LockOpen2Icon, 
  SliderIcon, SymbolIcon, FontSizeIcon, CursorArrowIcon, CursorTextIcon, TwitterLogoIcon, ResetIcon, 
  ClockIcon, IdCardIcon, CounterClockwiseClockIcon, HamburgerMenuIcon, DotsHorizontalIcon, DotsVerticalIcon, 
  Share1Icon, DownloadIcon, UploadIcon, ImageIcon, ExternalLinkIcon, Link2Icon, ScissorsIcon, KeyboardIcon,
  EyeOpenIcon, AvatarIcon, DashboardIcon, ListBulletIcon, ActivityLogIcon, BarChartIcon, PieChartIcon,
  DropdownMenuIcon, QuoteIcon, GlobeIcon, RocketIcon, BookmarkIcon, BookmarkFilledIcon, DrawingPinIcon,
  DrawingPinFilledIcon, ReaderIcon, ZoomInIcon, ZoomOutIcon, DoubleArrowLeftIcon, DoubleArrowRightIcon,
  DoubleArrowUpIcon, DoubleArrowDownIcon, TokensIcon, MixerHorizontalIcon, MixerVerticalIcon, ArchiveIcon,
  CrumpledPaperIcon, StarFilledIcon, StopwatchIcon, LapTimerIcon, ClipboardIcon, ClipboardCopyIcon,
  DesktopIcon, LaptopIcon, MobileIcon, EnterFullScreenIcon, ExitFullScreenIcon, ChatBubbleIcon,
  FileTextIcon, CheckboxIcon, TableIcon, CopyIcon, EnterIcon, EyeNoneIcon, ChevronUpIcon, 
  ChevronLeftIcon, ChevronRightIcon, FaceIcon, FontFamilyIcon, VideoIcon, ShuffleIcon, 
  LoopIcon, MixIcon, HeadingIcon 
} from '@radix-ui/react-icons';
import { ChevronDownIcon } from "@radix-ui/themes";

/**
 * @private
 * @description Immutable mapping table linking programmatic design token keys to Radix UI SVG icon subcomponents.
 */
const iconMap = {
  sun: SunIcon,
  moon: MoonIcon,
  settings: GearIcon,
  user: PersonIcon,
  cube: CubeIcon,
  heart: HeartIcon,
  backpack: BackpackIcon,
  questionmark: QuestionMarkIcon,
  questionmarkcircled: QuestionMarkCircledIcon,
  checkcircled: CheckCircledIcon,
  check: CheckIcon,
  chat: ChatBubbleIcon,
  enter: EnterIcon,
  exit: ExitIcon,
  calendar: CalendarIcon,
  camera: CameraIcon,
  star: StarIcon,
  starfilled: StarFilledIcon,
  code: CodeIcon,
  plus: PlusIcon,
  pluscircled: PlusCircledIcon,
  minus: MinusIcon,
  minuscircled: MinusCircledIcon,
  codesandbox: CodeSandboxLogoIcon,
  cardstack: CardStackIcon,
  cardstackminus: CardStackMinusIcon,
  cardstackplus: CardStackPlusIcon,
  stack: StackIcon,
  layers: LayersIcon,
  input: InputIcon,
  search: MagnifyingGlassIcon,
  cancel: Cross1Icon,
  close: Cross2Icon,
  crosshair: Crosshair2Icon,
  github: GitHubLogoIcon,
  instagram: InstagramLogoIcon,
  twitter: TwitterLogoIcon,
  linkedin: LinkedInLogoIcon,
  file: FileIcon,
  filetext: FileTextIcon,
  home: HomeIcon,
  delete: TrashIcon,
  bell: BellIcon,
  switch: SwitchIcon,
  caretup: CaretUpIcon,
  caretdown: CaretDownIcon,
  caretleft: CaretLeftIcon,
  caretright: CaretRightIcon,
  caretsort: CaretSortIcon,
  chevronup: ChevronUpIcon,
  chevrondown: ChevronDownIcon,
  chevronleft: ChevronLeftIcon,
  chevronright: ChevronRightIcon,
  doublearrowup: DoubleArrowUpIcon,
  doublearrowdown: DoubleArrowDownIcon,
  doublearrowleft: DoubleArrowLeftIcon,
  doublearrowright: DoubleArrowRightIcon,
  notallowed: CircleBackslashIcon,
  infocircled: InfoCircledIcon,
  envelopeopen: EnvelopeOpenIcon,
  envelopeclosed: EnvelopeClosedIcon,
  paperplane: PaperPlaneIcon,
  lockclosed: LockClosedIcon,
  lockopen: LockOpen2Icon,
  slider: SliderIcon,
  refresh: SymbolIcon,
  fontsize: FontSizeIcon,
  cursorarrow: CursorArrowIcon,
  cursortext: CursorTextIcon,
  reset: ResetIcon,
  clock: ClockIcon,
  idcard: IdCardIcon,
  history: CounterClockwiseClockIcon,
  hamburgermenu: HamburgerMenuIcon,
  elipsishorizontal: DotsHorizontalIcon,
  elipsisvertical: DotsVerticalIcon,
  share: Share1Icon,
  download: DownloadIcon,
  upload: UploadIcon,
  image: ImageIcon,
  externallink: ExternalLinkIcon,
  hyperlink: Link2Icon,
  scissors: ScissorsIcon,
  keyboard: KeyboardIcon,
  eyeopen: EyeOpenIcon,
  eyeclosed: EyeNoneIcon,
  avatar: AvatarIcon,
  dashboard: DashboardIcon,
  table: TableIcon,
  listbullet: ListBulletIcon,
  activitylog: ActivityLogIcon,
  barchart: BarChartIcon,
  piechart: PieChartIcon,
  dropdown: DropdownMenuIcon,
  checkbox: CheckboxIcon,
  quote: QuoteIcon,
  globe: GlobeIcon,
  rocket: RocketIcon,
  bookmark: BookmarkIcon,
  bookmarkfilled: BookmarkFilledIcon,
  pin: DrawingPinIcon,
  pinfilled: DrawingPinFilledIcon,
  reader: ReaderIcon,
  tokens: TokensIcon,
  zoomin: ZoomInIcon,
  zoomout: ZoomOutIcon,
  mixerhorizontal: MixerHorizontalIcon,
  mixervertical: MixerVerticalIcon,
  mix: MixIcon,
  archive: ArchiveIcon,
  crumpledpaper: CrumpledPaperIcon,
  stopwatch: StopwatchIcon,
  laptimer: LapTimerIcon,
  clipboard: ClipboardIcon,
  clipboardcopy: ClipboardCopyIcon,
  desktop: DesktopIcon,
  laptop: LaptopIcon,
  mobile: MobileIcon,
  enterfullscreen: EnterFullScreenIcon,
  exitfullscreen: ExitFullScreenIcon,
  copy: CopyIcon,
  face: FaceIcon,
  fontfamily: FontFamilyIcon,
  video: VideoIcon,
  shuffle: ShuffleIcon,
  loop: LoopIcon,
  heading: HeadingIcon,
} as const;

/**
 * @type IconName
 * @description Strongly-typed strict union of all valid design tokens keys available to render.
 */
export type IconName = keyof typeof iconMap;

export interface DynamicIconProps extends ComponentPropsWithoutRef<typeof SunIcon> {
  /** 
   * The registered key identifier pointing to the desired SVG subcomponent.
   * @example name="settings"
   */
  name: IconName;
}

/**
 * @component Icon
 * @description Master dynamic icon primitive. Resolves design system registry strings into type-safe interactive visual glyphs.
 * @param {DynamicIconProps} props - Properties including the literal-bound component key name and standard SVG overrides.
 * @returns {JSX.Element | null} The resolved Radix UI icon component wrapper or null if missing.
 */
export const Icon = React.memo(({ name, ...props }: DynamicIconProps): JSX.Element | null => {
  const IconComponent = iconMap[name];

  if (!IconComponent) {
    return null;
  }

  return <IconComponent {...props} />;
});

Icon.displayName = 'Icon';