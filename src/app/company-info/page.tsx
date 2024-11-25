"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db, storage } from "@/lib/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Button, Spinner, Chip } from "@nextui-org/react";
import Image from "next/image";
// import { toast } from "react-hot-toast";

interface UploadProgress {
  [key: string]: number;
}

export default function CompanyInfo() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({});
  const [isFormValid, setIsFormValid] = useState(false);

  const [formData, setFormData] = useState({
    
    logo: null as File | null,
    documents: [] as File[],
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/register");
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    const checkFormValidity = () => {
      const hasLogo = formData.logo !== null;
      const hasDocuments = formData.documents.length > 0;
      setIsFormValid(hasLogo && hasDocuments);
    };

    checkFormValidity();
  }, [formData.logo, formData.documents]);

  const handleFileUpload = async (file: File, path: string) => {
    const storageRef = ref(storage, `${path}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress((prev) => ({
            ...prev,
            [file.name]: progress,
          }));
        },
        (error) => {
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid) {
      setError("Veuillez sélectionner un logo et au moins un document");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error("No user found");

      let logoUrl = "";
      let documentUrls: string[] = [];

      // Upload logo
      // if (formData.logo) {
      //   logoUrl = await handleFileUpload(
      //     formData.logo,
      //     `companies/${userId}/logo`
      //   ) as string;
      // }

      // Upload documents
      // for (const doc of formData.documents) {
      //   const docUrl = await handleFileUpload(
      //     doc,
      //     `companies/${userId}/documents`
      //   ) as string;
      //   documentUrls.push(docUrl);
      // }

      // Update company data in Firestore
      // await updateDoc(doc(db, "companies", userId), {
      //   logoUrl,
      //   documentUrls,
      //   updatedAt: new Date().toISOString(),
      // });

      // toast.success("Documents uploaded successfully");
      // window.open("/dashboard", "_blank");
      router.push("/dashboard");
    } catch (err: any) {
      console.log(err);
      setError("Une erreur s'est produite lors du téléchargement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <Image
        src="/unibtp.png"
        width={500}
        height={300}
        alt="Company Information"
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      />
      <div className="absolute left-[5%] h-[80vh] rounded-lg overflow-y-auto right-[5%] md:left-[35%] md:right-[35%] mx-auto  bg-gray-200 py-12 px-4 sm:px-6 lg:px-8 z-50 flex flex-col">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* <div>
            <h2 className="text-center text-3xl font-extrabold text-gray-900">
              Company Information
            </h2>
          </div> */}

          <form onSubmit={handleSubmit} className="mt-8 space-y-6 flex-1  p-6">
            {error && (
              <div className="mb-4">
                <Chip
                  color="danger"
                  variant="flat"
                  className="w-full"
                >
                  {error}
                </Chip>
              </div>
            )}

            {/* <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic Information</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <input
                  type="text"
                  required
                  className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Company Name"
                  value={formData.companyName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      companyName: e.target.value,
                    }))
                  }
                />
                <input
                  type="tel"
                  required
                  className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                />
                <input
                  type="url"
                  className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Website"
                  value={formData.website}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      website: e.target.value,
                    }))
                  }
                />
                <textarea
                  required
                  className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Company Description"
                  rows={2}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
              </div>
            </div> */}

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Les médias de l'entreprise</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Logo de l'entreprise
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        logo: e.target.files?.[0] || null,
                      }))
                    }
                  />
                  {uploadProgress[formData.logo?.name || ""] > 0 && (
                    <div className="mt-2">
                      <div className="bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
                          style={{
                            width: `${
                              uploadProgress[formData.logo?.name || ""]
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Documents administratifs
                  </label>
                  <input
                    type="file"
                    multiple
                    className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        documents: Array.from(e.target.files || []),
                      }))
                    }
                  />
                  {formData.documents.map(
                    (doc) =>
                      uploadProgress[doc.name] > 0 && (
                        <div key={doc.name} className="mt-2">
                          <p className="text-sm text-gray-600">{doc.name}</p>
                          <div className="bg-gray-200 rounded-full h-2.5">
                            <div
                              className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
                              style={{ width: `${uploadProgress[doc.name]}%` }}
                            ></div>
                          </div>
                        </div>
                      )
                  )}
                </div>
              </div>
            </div>

            {/* <div className="space-y-4">
              <h3 className="text-lg font-medium">Address Information</h3>
              <textarea
                required
                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Full Address"
                rows={3}
                value={formData.address}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, address: e.target.value }))
                }
              />
            </div> */}

            <div>
              <Button
                type="submit"
                color="primary"
                isDisabled={!isFormValid || loading}
                isLoading={loading}
                spinner={
                  <Spinner 
                    size="sm" 
                    color="white" 
                  />
                }
              >
                {loading ? "Téléchargement en cours..." : "Importer les documents"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
