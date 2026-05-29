import { SELECTION_LABELS, SORT_LABELS, VISIBLE_LABELS } from "@constants";

export interface OperatingHourType {
  id: number;
  restaurant_id: string;
  day_of_week: number;
  is_off: boolean;
  open_time: string | null;
  close_time: string | null;
  break_start: string | null;
  break_end: string | null;
  last_order: string | null;
  created_at: string;
}

// https://data.ydp.go.kr/openinf/sheetview.jsp?infId=OA-18670&tMenu=11
export interface RestaurantType {
  id: string;
  name: string;
  category: string;
  phone: string;
  road_address: string; // 도로명
  land_address: string; // 지번
  status_number: string;
  x: string;
  y: string;
  map_x: string;
  map_y: string;
  created_at: string;
  is_visible: boolean;
  has_room: boolean;
  has_course: boolean;
  keyword: string;
  operating_hours: OperatingHourType[];
  is_complete: boolean;
  comments: CommentType[];

  // original
  OPNSFTEAMCODE?: string; // 개방자치단체코드
  MGTNO?: string; // 관리번호
  APVPERMYMD?: string; // 인허가일자
  APVCANCELYMD?: string; // 인허가취소일자
  TRDSTATEGBN?: string; // 영업상태구분코드
  TRDSTATENM?: string; // 영업상태명
  DTLSTATEGBN?: string; // 상세영업상태코드
  DTLSTATENM?: string; // 상세영업상태명
  DCBYMD?: string; // 폐업일자
  CLGSTDT?: string; // 휴업시작일자
  CLGENDDT?: string; // 휴업종료일자
  ROPNYMD?: string; // 재개업일자
  SITETEL?: string; // 소재지전화
  SITEAREA?: string; // 소재지면적
  SITEPOSTNO?: string; // 소재지우편번호
  SITEWHLADDR?: string; // 소재지전체주소
  RDNWHLADDR?: string; // 소재지도로명전체주소
  RDNPOSTNO?: string; // 소재지도로명우편번호
  BPLCNM?: string; // 사업장명
  LASTMODTS?: string; // 최종수정시점
  UPDATEGBN?: string; // 데이터갱신구분
  UPDATEDT?: string; // 데이터갱신일자
  UPTAENM?: string; // 업태명
  X?: string; // 좌표정보(x)
  Y?: string; // 좌표정보(y)
  SNTUPTAENM?: string; // 위생업태명
  MANEIPCNT?: string; // 남성종사자수
  WMEIPCNT?: string; // 여성종사자수
  TRDPJUBNSENM?: string; // 영업장주변구분명
  LVSENM?: string; // 등급구분명
  WTRSPLYFACILSENM?: string; // 급수시설구분명
  TOTEPNUM?: string; // 총종업원수
  HOFFEPCNT?: string; // 본사종업원수
  FCTYOWKEPCNT?: string; // 공장사무직종업원수
  FCTYSILJOBEPCNT?: string; // 공장판매직종업원수
  FCTYPDTJOBEPCNT?: string; // 공장생산직종업원수
  BDNGOWNSENM?: string; // 건물소유구분명
  ISREAM?: string; // 보증액
  MONAM?: string; // 월세액
  MULTUSNUPSOYN?: string; // 다중이용업소여부
  FACILTOTSCP?: string; // 시설총규모
  JTUPSOASGNNO?: string; // 전통업소지정번호
  JTUPSOMAINEDF?: string; // 전통업소주된음식
  HOMEPAGE?: string; // 홈페이지
}

export interface ListItemType {
  key?: string | undefined;
  data: string | string[] | null;
  label: string;
  css?: string;
  width?: number;
  selectedOptions?: [string, string][];
}

export interface CommentType {
  id: number;
  content: string;
  restaurant_id: string;
  user_id: number;
  created_at: string;
  is_deleted: boolean;
  users?: {
    device: string;
    browser: string;
    location: string;
  };
}

export type VisibleFilterType = keyof typeof VISIBLE_LABELS;
export type SortFilterType = keyof typeof SORT_LABELS;
export type SelectionFilterType = keyof typeof SELECTION_LABELS;

export interface TimeType {
  day: number; // 0 (일) ~ 6 (토)
  time: string; // "HH:mm"
}

export type SupabaseUpdateType = "OPERATING_HOURS" | "COMMENTS" | "RESTAURANTS";
export type SupabaseValue = string | number | boolean | null;
