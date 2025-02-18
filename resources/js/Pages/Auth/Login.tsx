
import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Log in" />
            <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
                <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
                    <div className="w-full xl:w-5/12 p-14 lg:p-6  ">
                        <div>
                            <img
                                src="/img/icon/icon dashbuild.png"
                                className="w-28 mx-auto"
                            />
                        </div>
                        <div className="mt-8 flex flex-col items-center">
                            <h1 className="text-2xl font-extrabold">SIGN IN</h1>
                            <form
                                className="w-full flex-1 mt-8"
                                onSubmit={submit}
                            >
                                <div className="mx-auto max-w-sm">
                                    <div>
                                        <input
                                            className="w-full p-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            placeholder="Email"
                                            onChange={(e) =>
                                                setData("email", e.target.value)
                                            }
                                        />
                                        <InputError
                                            message={errors.email}
                                            className="mt-2 text-xs"
                                        />
                                    </div>
                                    <div>
                                        <input
                                            className="w-full p-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                                            placeholder="Password"
                                            id="password"
                                            type="password"
                                            name="password"
                                            value={data.password}
                                            onChange={(e) =>
                                                setData(
                                                    "password",
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <div className="flex items-center justify-between">
                                            <InputError
                                                message={errors.password}
                                                className="mt-2 text-xs"
                                            />
                                            {canResetPassword && (
                                                <Link
                                                    href={route(
                                                        "password.request"
                                                    )}
                                                    className="rounded-md mt-3 text text-xs text-gray-600  hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                                >
                                                    Forgot your password?
                                                </Link>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        disabled={processing}
                                        className="mt-10 tracking-wide text-sm font-semibold bg-primary text-gray-100 w-full py-3 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                                    >
                                        <span>Sign In</span>
                                    </button>

                                    <p className="mt-10 text-sm">
                                        Don't have an account?
                                        <Link
                                            href={route("register")}
                                            className="rounded-md ms-2  mt-3 text text-sm text-primary font-bold  hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                        >
                                            Sign Up
                                        </Link>
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
                        <div className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat bg-[url('https://storage.googleapis.com/devitary-image-host.appspot.com/15848031292911696601-undraw_designer_life_w96d.svg')]"></div>
                    </div>
                </div>
            </div>
        </>
    );
}
