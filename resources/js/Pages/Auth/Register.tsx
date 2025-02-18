import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Log in" />
            <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
                <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
                    <div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
                        <div className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat bg-[url('https://storage.googleapis.com/devitary-image-host.appspot.com/15848031292911696601-undraw_designer_life_w96d.svg')]"></div>
                    </div>
                    <div className="w-full xl:w-5/12 p-14 lg:p-6  ">
                        <div>
                            <img
                                src="/img/icon/icon dashbuild.png"
                                className="w-28 mx-auto"
                            />
                        </div>
                        <div className="mt-8 flex flex-col items-center">
                            <h1 className="text-2xl font-extrabold">SIGN UP</h1>
                            <form
                                className="w-full flex-1 mt-8"
                                onSubmit={submit}
                            >
                                <div className="mx-auto max-w-sm">
                                    <div className="mb-5">
                                        <input
                                            className="w-full p-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                                            id="name"
                                            placeholder="Name"
                                            name="name"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData("name", e.target.value)
                                            }
                                            required
                                        />
                                        <InputError
                                            message={errors.name}
                                            className="mt-2 text-xs"
                                        />
                                    </div>
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
                                        <InputError
                                            message={errors.password}
                                            className="mt-2 text-xs"
                                        />
                                    </div>
                                    <div>
                                        <input
                                            className="w-full p-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                                            placeholder="Confirm Password"
                                            id="password_confirmation"
                                            type="password"
                                            name="password_confirmation"
                                            value={data.password_confirmation}
                                            onChange={(e) =>
                                                setData(
                                                    "password_confirmation",
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />
                                        <InputError
                                            message={
                                                errors.password_confirmation
                                            }
                                            className="mt-2 text-xs"
                                        />
                                    </div>

                                    <button
                                        disabled={processing}
                                        className="mt-10 tracking-wide text-sm font-semibold bg-primary text-gray-100 w-full py-3 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                                    >
                                        <span>Sign Up</span>
                                    </button>

                                    <p className="mt-10 text-sm">
                                        Have an account?
                                        <Link
                                            href={route("login")}
                                            className="rounded-md ms-2  mt-3 text text-sm text-primary font-bold  hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                        >
                                            Sign In
                                        </Link>
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
