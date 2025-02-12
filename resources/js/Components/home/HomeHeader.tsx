import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { buttonVariants } from "../ui/button";
import ProjectForm from "./Project/ProjectForm";
const HomeHeader = () => {
    return (
        <div>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <img
                        src="/img/icon/icon dashbuild.png"
                        className="w-16"
                        alt=""
                    />
                    <h3 className="text-xl font-bold">Welcome</h3>
                </div>
                <Dialog>
                    <DialogTrigger
                        className={buttonVariants({
                            variant: "default",
                            size: "sm",
                        })}
                    >
                        + Create New Project
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create a New Project</DialogTitle>
                            <DialogDescription>
                                Start a new project to easily manage your data and entities as needed.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-2">
                            <ProjectForm/>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
            <p className="text-[13px] mt-3">
                View, Analyze, and Manage Your Data in One Place with DashBuild.
                The Perfect Solution for All Your Dashboard Needs
            </p>
        </div>
    );
};

export default HomeHeader;
