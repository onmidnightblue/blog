import { useCallback } from "react";

export const useExternalMap = () => {
  const openNaverMap = useCallback((name: string) => {
    const query = encodeURIComponent(`서여의도 ${name}`);
    window.open(`https://map.naver.com/v5/search/${query}`, "_blank");
  }, []);

  const openKakaoMap = useCallback((name: string) => {
    const query = encodeURIComponent(`여의도 ${name}`);
    window.open(`https://map.kakao.com/link/search/${query}`, "_blank");
  }, []);

  return { openNaverMap, openKakaoMap };
};
