import PrimaryButton from "@/Components/PrimaryButton";
import { Head, Link, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("verification.send"));
    };

    return (
        <>
            <Head title="Verify Your Email" />

            <div className="flex min-h-screen bg-gray-100">
                {/* Left Section */}
                <div className="hidden md:flex flex-1 items-center justify-center bg-blue-50">
                    <img
                        src="https://storage.googleapis.com/devitary-image-host.appspot.com/15848031292911696601-undraw_designer_life_w96d.svg"
                        alt="Email Illustration"
                        className="w-80 h-80"
                    />
                </div>

                {/* Right Section */}
                <div className="flex-1 flex items-center p-6">
                    <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6 ">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Verify your email address
                        </h2>

                        <p className="mt-2 text-gray-600 text-sm">
                            To start using our service, confirm your email with
                            the email we sent.
                        </p>
                        {status === "verification-link-sent" && (
                            <div className="mb-4 p-3 text-sm font-medium mt-5 bg-green-100 text-green-700 rounded-md border border-green-400">
                                Check your inbox for an email with instructions
                                to verify your email address.
                            </div>
                        )}

                        <form onSubmit={submit} className="mt-7 mb-4 w-full">
                            <button
                                disabled={processing}
                                className="w-full bg-primary text-white hover:bg-blue-700 py-2.5 rounded-sm text-sm font-medium"
                            >
                                Resend Email
                            </button>
                        </form>

                        <div className="text-end">
                            <Link
                                href={route("logout")}
                                method="post"
                                as="button"
                                className="rounded-md text-sm  text-gray-600  hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Log Out
                            </Link>

                        </div>

                        <p className="mt-4 text-sm text-gray-600">
                            Need help?{" "}
                            <Link
                                href="#"
                                className="text-blue-600 font-medium"
                            >
                                Contact customer support
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
