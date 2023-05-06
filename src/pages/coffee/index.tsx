import { Button, IconButton } from "@mui/material";
import { FolderTab } from "@shared/components/Home/FolderTab";
import { folderContent } from "@shared/components/Home/Tabs";
import { logOut } from "@shared/store/modules/authSlice";
import { AppDispatch } from "@shared/store/store";
import { useRouter } from "next/router";
import { SyntheticEvent, useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { BsArrowsAngleContract, BsArrowsAngleExpand } from "react-icons/bs";
import { useDispatch } from "react-redux";

const possibleBackgrounds = ["/background1.png", "/background2.png", "/background3.png"];

const BACKGROUND_CHANGE_DELAY = 30 * 1000; // 30 segs

export type HomeTabs = "histórico" | "pagamentos";

const getBackgroundImageBasedOnTime = () =>
  possibleBackgrounds[Math.floor((Date.now() / BACKGROUND_CHANGE_DELAY) % possibleBackgrounds.length)];

export default function Home() {
  const dispatch: AppDispatch = useDispatch();
  const [backgroundImg, setBackgroundImg] = useState(getBackgroundImageBasedOnTime);
  const [openTab, setOpenTab] = useState<HomeTabs>();
  const [expandedTab, setExpandedTab] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => setBackgroundImg(getBackgroundImageBasedOnTime()), BACKGROUND_CHANGE_DELAY);

    return () => clearInterval(interval);
  }, []);

  const handleOpenTab = (tab?: HomeTabs) => {
    setOpenTab(tab);
  };

  useEffect(() => {
    if (!openTab && expandedTab) setExpandedTab(false);
  }, [openTab]);

  const handleCloseCurrentTab = (e: SyntheticEvent) => {
    if (e.currentTarget === e.target) setOpenTab(undefined);
  };

  const handleExpand = () => {
    setExpandedTab((state) => !state);
  };

  const handleLogout = async () => {
    console.log("busdaibduias");
    dispatch(logOut());
    router.push("/login");
    console.log("busdaibduias2");
  };

  return (
    <main>
      <div
        className="flex w-full absolute inset-0 justify-center items-center flex-col gap-2"
        style={{
          backgroundImage: `url(${backgroundImg})`,
          objectFit: "cover",
          backgroundSize: "cover",
          transition: "background 3s",
        }}
      >
        <div className="botaoGambiarrado fixed top-10 left-10 z-1000">
          <Button onClick={handleLogout}>Logout da gambiarra</Button>
        </div>

        <div className="rounded-full z-10 bg-black w-[100px] h-[100px] outline-white outline flex items-center justify-center">
          {/* <Image src="https://pixy.org/src/12/128443.png" alt="" width={100} height={20} /> */}
          <small>Alguma coisa</small>
        </div>
        <span className="text-white max-w-[230px] text-center p-2 hover:bg-[#000000aa] transition-[background-color_0.3s] rounded-lg">
          Último café feito ás 10:23:36 de {new Date().toLocaleDateString("pt-BR")}
        </span>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 z-[50]"
        onClick={(e) => handleCloseCurrentTab(e)}
        style={{
          backgroundColor: openTab ? "#00000055" : "transparent",
          transition: "background-color 0.2s",
          pointerEvents: "all",
          top: openTab ? "0" : "auto",
        }}
      >
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden">
          <div className="flex justify-center items-end gap-3">
            <FolderTab selectedTab={openTab} tabName="histórico" onTabClick={handleOpenTab}>
              Histórico
            </FolderTab>
            <FolderTab selectedTab={openTab} tabName="pagamentos" onTabClick={handleOpenTab}>
              Pagamentos
            </FolderTab>
          </div>
          <div
            id="folder-content"
            className="bg-coffee-light-200 mt-[-1px] z-[100] rounded-t-3xl px-4"
            style={{
              marginBottom: openTab ? 0 : -200,
              height: expandedTab ? window.innerHeight - 50 : 200,
              transition: "margin 0.2s, height 0.2s",
            }}
          >
            <div className="p-5 w-full flex justify-end text-black">
              <IconButton size="small" onClick={handleExpand}>
                {expandedTab ? <BsArrowsAngleContract size={16} /> : <BsArrowsAngleExpand size={16} />}
              </IconButton>
              <IconButton size="small" onClick={() => setOpenTab(undefined)}>
                <AiOutlineClose size={16} />
              </IconButton>
            </div>

            {(openTab && folderContent[openTab]) ?? <></>}
          </div>
        </div>
      </div>
    </main>
  );
}
