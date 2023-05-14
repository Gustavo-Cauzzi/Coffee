import { IconButton, Popover } from "@mui/material";
import { User } from "@shared/@types/User";
import { FolderTab } from "@shared/components/Home/FolderTab";
import { folderContent } from "@shared/components/Home/Tabs";
import { logOut } from "@shared/store/modules/authSlice";
import { AppDispatch, RootState } from "@shared/store/store";
import { useRouter } from "next/router";
import { SyntheticEvent, useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { BsArrowsAngleContract, BsArrowsAngleExpand } from "react-icons/bs";
import { FiPower, FiUser } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";

const possibleBackgrounds = ["/background1.png", "/background2.png", "/background3.png"];

const BACKGROUND_CHANGE_DELAY = 30 * 1000; // 30 segs

export type HomeTabs = "histórico" | "pagamentos";

const getBackgroundImageBasedOnTime = () =>
  possibleBackgrounds[Math.floor((Date.now() / BACKGROUND_CHANGE_DELAY) % possibleBackgrounds.length)];

export default function Home() {
  const [backgroundImg, setBackgroundImg] = useState(getBackgroundImageBasedOnTime);
  const [openTab, setOpenTab] = useState<HomeTabs>();
  const [expandedTab, setExpandedTab] = useState(false);

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
        <UserMenu />

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

const UserMenu: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const user = useSelector<RootState, User | undefined>((state) => state.auth.user);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    if (!anchorEl) setAnchorEl(event.currentTarget);
    setOpen((state) => !state);
  };

  const handleLogout = async () => {
    console.log("busdaibduias");
    dispatch(logOut());
    router.push("/login");
    console.log("busdaibduias2");
  };

  const id = "user-menu";

  return (
    <>
      <button
        aria-describedby={id}
        type="button"
        className="absolute top-10 right-10 z-10 bg-transparent transition-[background-color] cursor-pointer hover:bg-[#000000aa] p-3 rounded-full"
        onClick={handleOpenMenu}
      >
        <FiUser size={25} />
      </button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={() => setOpen(false)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{ style: { borderRadius: 20 } }}
      >
        <div className="bg-white p-2 flex flex-col font-coffee gap-2 text-black min-w-[15rem] shadow-2xl">
          <div className="flex gap-4 items-center px-2">
            <FiUser size={27} />

            <div className="flex flex-col ">
              <span>{user?.name}</span>
              <span className="text-gray-400">@{user?.username}</span>
            </div>
          </div>

          <hr />

          <button
            className="py-0.5 px-3 rounded-lg grid grid-cols-[1rem_1fr] gap-4 items-center transition-colors hover:bg-[#00000033]"
            onClick={handleLogout}
          >
            <FiPower />
            <span className="text-left">Sair</span>
          </button>
        </div>
      </Popover>
    </>
  );
};
