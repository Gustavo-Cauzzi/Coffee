import {
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Popover,
  Tooltip,
} from "@mui/material";
import { DataGrid, GridRenderCellParams } from "@mui/x-data-grid";
import { User } from "@shared/@types/User";
import { History } from "@shared/@types/History";
import { FolderTab } from "@shared/components/Home/FolderTab";
import { folderContent } from "@shared/components/Home/Tabs";
import { useFolderActions } from "@shared/context/FolderActionContext";
import { getApi } from "@shared/services/api";
import { logOut } from "@shared/store/modules/authSlice";
import { AppDispatch, RootState } from "@shared/store/store";
import { useRouter } from "next/router";
import { ReactNode, SyntheticEvent, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineClose } from "react-icons/ai";
import { BsArrowsAngleContract, BsArrowsAngleExpand } from "react-icons/bs";
import { FiCoffee, FiInfo, FiPower, FiShield, FiTrash2, FiUser } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import Pusher from "pusher-js";
import Head from "next/head";
import { findAllHistory } from "@shared/store/modules/historySlice";
import { format } from "date-fns";

const possibleBackgrounds = ["/background1.png" /*, "/background2.png", "/background3.png" */];
export type HomeTabs = "histórico" | "cobrancas" | "pagamentos";

const BACKGROUND_CHANGE_DELAY = 30 * 1000; // 30 segs
const FOLDER_HEIGHT_MINIFIED = 300;

const getBackgroundImageBasedOnTime = () =>
  possibleBackgrounds[Math.floor((Date.now() / BACKGROUND_CHANGE_DELAY) % possibleBackgrounds.length)];

const setupSocket = async () => {
  getApi().get("/pusher");
  const pusher = new Pusher("8a13f1500977643c14d0", {
    cluster: "us2",
  });

  const channel = pusher.subscribe("coffee");
  channel.bind("newCoffee", (data: { name: string }) => {
    new Notification(`${data.name} passou café agora mesmo!`);
  });
};

const requestPermission = async () => {
  const permission = await Notification.requestPermission();
  const warned = localStorage.getItem("@coffee/warned");
  if (!warned && permission !== "granted") {
    toast("É recomendado que uso das notificações para avisar quando há um café novo passado");
    localStorage.setItem("@coffee/warned", "1");
  }
};

export default function Home() {
  const dispatch: AppDispatch = useDispatch();
  const { actionButton } = useFolderActions();
  const [backgroundImg, setBackgroundImg] = useState(getBackgroundImageBasedOnTime);
  const [openTab, setOpenTab] = useState<HomeTabs>();
  const [expandedTab, setExpandedTab] = useState(false);

  const user = useSelector<RootState, User | undefined>((state) => state.auth.user);
  const isManager = useSelector<RootState, boolean>((state) => state.auth.user?.isManager ?? false);

  const isHistoryLoading = useSelector<RootState, boolean>((state) => state.history.isLoading);
  const mostRecentCoffeHistory = useSelector<RootState, History>((state) => state.history.history[0]);

  useEffect(() => {
    dispatch(findAllHistory());
    const interval = setInterval(() => setBackgroundImg(getBackgroundImageBasedOnTime()), BACKGROUND_CHANGE_DELAY);
    requestPermission();
    setupSocket();

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

  const handleNewCoffeeConfirmed = async () => {
    if (!user) {
      toast.error("Usuário atual não encontrado");
      return;
    }

    const toastId = toast.loading("Passando café");
    getApi()
      .post("/histories", {
        user: {
          id: user.id,
          name: user.name,
        },
      } as History)
      .then(() => toast.success("Café passado com sucesso. Todos serão notificados!"))
      .catch(() => toast.error("Não foi possível passar o café!"))
      .finally(() => toast.dismiss(toastId));
  };

  const handleNewCoffee = () => {
    toast(
      (t) => (
        <div className="flex gap-1 w-full">
          <span>Isso irá notificar para todos os usuários logados que um novo café foi passado. Confirmar ação?</span>

          <Button size="small" onClick={() => toast.dismiss(t.id)}>
            Cancelar
          </Button>

          <Button
            size="small"
            variant="contained"
            onClick={() => {
              toast.dismiss(t.id);
              handleNewCoffeeConfirmed();
            }}
          >
            Sim
          </Button>
        </div>
      ),
      { style: { maxWidth: 700 } }
    );
  };

  return (
    <>
      <Head>
        <title>Café</title>
      </Head>

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

          <div className="flex bg-white flex-col rounded-lg gap-2 items-center p-4 min-w-[15rem]">
            <Image
              src="https://cdn.pixabay.com/photo/2016/06/24/10/46/drinks-1477040_1280.png"
              alt=""
              width={100}
              height={80}
            />
            {/* <Image src="https://freesvg.org/img/coffee-cup.png" alt="" width={100} height={80} /> */}

            {!mostRecentCoffeHistory || isHistoryLoading ? (
              <div className="my-1">
                <CircularProgress />
              </div>
            ) : (
              <span className="text-coffee-light-600 max-w-sm text-center p-2 transition-[background-color_0.3s] rounded-lg">
                Último café feito ás {format(mostRecentCoffeHistory.created_at, "HH:mm:ss 'de' dd/MM/yyyy")}
              </span>
            )}

            <Button variant="contained" size="large" onClick={handleNewCoffee} startIcon={<FiCoffee />}>
              Café novo!!
            </Button>
          </div>
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
              {isManager && (
                <FolderTab selectedTab={openTab} tabName="cobrancas" onTabClick={handleOpenTab}>
                  Cobranças
                </FolderTab>
              )}
              <FolderTab selectedTab={openTab} tabName="pagamentos" onTabClick={handleOpenTab}>
                Pagamentos
              </FolderTab>
            </div>
            <div
              id="folder-content"
              className="bg-coffee-light-200 mt-[-1px] z-[100] rounded-t-3xl px-4 nice-scrollbar"
              data-folder-content
              style={{
                marginBottom: openTab ? 0 : -FOLDER_HEIGHT_MINIFIED,
                height: expandedTab ? window.innerHeight - 50 : FOLDER_HEIGHT_MINIFIED,
                transition: "margin 0.2s, height 0.2s",
                overflow: "overlay",
              }}
            >
              <div className="p-5 w-full flex justify-between text-black">
                {(openTab && actionButton[openTab]) || <div />}

                <div className="flex">
                  <IconButton size="small" onClick={handleExpand}>
                    {expandedTab ? <BsArrowsAngleContract size={16} /> : <BsArrowsAngleExpand size={16} />}
                  </IconButton>
                  <IconButton size="small" onClick={() => setOpenTab(undefined)}>
                    <AiOutlineClose size={16} />
                  </IconButton>
                </div>
              </div>

              {(openTab && folderContent[openTab]) ?? <></>}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

const UserMenu: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isAdminDialogOpen, setIsAdminDialogOpen] = useState(false);

  const user = useSelector<RootState, User | undefined>((state) => state.auth.user);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    if (!anchorEl) setAnchorEl(event.currentTarget);
    setOpen((state) => !state);
  };

  const handleLogout = async () => {
    setOpen(false);
    const toastId = toast.loading("Saindo...");
    dispatch(logOut());
    router.push("/login");
    toast.dismiss(toastId);
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

          {user?.isAdmin && (
            <button
              className="py-0.5 px-3 rounded-lg grid grid-cols-[1rem_1fr] gap-4 items-center transition-colors hover:bg-[#00000033]"
              onClick={() => setIsAdminDialogOpen(true)}
            >
              <FiShield />
              <span className="text-left">Administrar</span>
            </button>
          )}

          <button
            className="py-0.5 px-3 rounded-lg grid grid-cols-[1rem_1fr] gap-4 items-center transition-colors hover:bg-[#00000033]"
            onClick={handleLogout}
          >
            <FiPower />
            <span className="text-left">Sair</span>
          </button>
        </div>
      </Popover>

      <AdminDialog open={isAdminDialogOpen} onClose={() => setIsAdminDialogOpen(false)} />
    </>
  );
};

const AdminDialog: React.FC<{ open: boolean; onClose: () => any }> = ({ onClose, open }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selected, setSelected] = useState<User["id"][]>([]);

  useEffect(() => {
    if (!open) return;

    setSelected([]);
    if (users.length > 0) return;

    const getData = async () => {
      const tid = toast.loading("Carregando usuários...");
      const response = await getApi()
        .get("/users")
        .finally(() => toast.dismiss(tid));
      setUsers(response.data.users);
    };

    getData();
  }, [open]);

  const handleUpdate = async (user: User) => {
    const tid = toast.loading("Alterando...");
    await getApi()
      .put("/users", user)
      .finally(() => toast.dismiss(tid));
    setUsers((state) => state.map((u) => (u.id === user.id ? user : u)));
  };

  const handleDelete = () => {
    confirmActionToast("Absoluta certeza??", () => confirmActionToast("100%?", handleDeleteConfirmed));
  };

  const handleDeleteConfirmed = async () => {
    const toastId = toast.loading("Excluíndo");
    await Promise.all(selected.map((id) => getApi().delete(`/users/${id}`))).finally(() => toast.dismiss(toastId));
    setUsers((state) => state.filter((u) => !selected.some((id) => u.id === id)));
    setSelected([]);
  };

  const confirmActionToast = (content: ReactNode, action: () => any) => {
    toast(
      (t) => (
        <div className="flex w-full justify-between items-center">
          {content}
          <div className="flex gap-2">
            <Button onClick={() => toast.dismiss(t.id)} variant="contained">
              Não!
            </Button>
            <Button
              onClick={() => {
                toast.dismiss(t.id);
                action();
              }}
            >
              Sim
            </Button>
          </div>
        </div>
      ),
      { style: { width: 600 } }
    );
  };

  return (
    <Dialog open={open} maxWidth="sm" fullWidth onClose={onClose}>
      <DialogTitle>
        <div className="flex gap-2 items-center">
          Administração
          <Tooltip arrow title="Tela acessível apenas para usuários administradores como você" placement="top">
            <div>
              <IconButton color="primary">
                <FiInfo />
              </IconButton>
            </div>
          </Tooltip>
        </div>
      </DialogTitle>
      <DialogContent>
        <div className="flex flex-col max-h-[90vh]">
          <div className="flex justify-end">
            <Button startIcon={<FiTrash2 />} onClick={handleDelete}>
              Excluir
            </Button>
          </div>
          <DataGrid
            rows={users}
            autoHeight
            checkboxSelection
            disableRowSelectionOnClick
            rowSelectionModel={selected}
            onRowSelectionModelChange={(newSelection) => setSelected(newSelection as User["id"][])}
            columns={[
              { field: "username", headerName: "Usuário", flex: 1 },
              { field: "name", headerName: "Nome", flex: 1 },
              {
                field: "isAdmin",
                headerName: "Admin",
                width: 100,
                renderCell: (p: GridRenderCellParams<User, boolean | undefined>) => (
                  <Checkbox checked={!!p.value} onChange={() => handleUpdate({ ...p.row, isAdmin: !p.value })} />
                ),
              },
              {
                field: "isManager",
                headerName: "Gerente",
                width: 100,
                renderCell: (p: GridRenderCellParams<User, boolean | undefined>) => (
                  <Checkbox checked={!!p.value} onChange={() => handleUpdate({ ...p.row, isManager: !p.value })} />
                ),
              },
            ]}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button color="primary" variant="contained" onClick={onClose}>
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
