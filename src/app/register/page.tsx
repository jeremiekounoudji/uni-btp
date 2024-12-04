"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword,sendEmailVerification } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardHeader,
  CardBody,
  Input,
  Button,
  Progress,
  Spinner,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Checkbox,
} from "@nextui-org/react";

interface FormData {
  // Company Details
  companyName: string;
  registrationNumber: string;
  taxId: string;
  industry: string;
  foundedDate: string;

  // Contact Details
  email: string;
  phone: string;
  website: string;
  address: string;
  city: string;
  country: string;

  // CEO/Owner Information
  ceoName: string;
  ceoEmail: string;
  ceoPhone: string;

  // Account Credentials
  password: string;
  confirmPassword: string;
}

export default function Register() {
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    companyName: "",
    registrationNumber: "",
    taxId: "",
    industry: "",
    foundedDate: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    city: "",
    country: "",
    ceoName: "",
    ceoEmail: "",
    ceoPhone: "",
    password: "",
    confirmPassword: "",
  });

  const [showTermsModal, setShowTermsModal] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    // e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      if (userCredential.user) {
        // Save additional company data to Firestore
        await setDoc(doc(db, "companies", userCredential.user.uid), {
          companyName: formData.companyName,
          registrationNumber: formData.registrationNumber,
          taxId: formData.taxId,
          industry: formData.industry,
          foundedDate: formData.foundedDate,
          isActive: true,
          isAccepted: true,
          contact: {
            email: formData.email,
            phone: formData.phone,
            website: formData.website,
            address: formData.address,
            city: formData.city,
            country: formData.country,
          },
          ceo: {
            name: formData.ceoName,
            email: formData.ceoEmail,
            phone: formData.ceoPhone,
          },
          createdAt: new Date().toISOString(),
          hasPayedAdhesion: false,
          adhesionPaymentDate: null
        });
        await sendEmailVerification(userCredential.user);
        toast.success(`Email de vérification envoyé à ${formData.email}. Veuillez le confirmer`);
        if (formData.email==process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
        // router.push("/company-info");
      }
    } catch (err: any) {
      console.log(err.message);
      console.log(formData.email);

      if (err.code === "auth/email-already-in-use") {
        setError(
          "L'adresse e-mail est déjà utilisée. Veuillez choisir une autre adresse e-mail."
        );
      } else if (err.code === "auth/invalid-email") {
        setError(
          "L'adresse e-mail est invalide. Veuillez saisir une adresse e-mail valide."
        );
      } else if (err.code === "auth/weak-password") {
        setError(
          "Le mot de passe est trop faible. Veuillez choisir un mot de passe plus sécurisé."
        );
      } else if (err.code === "auth/network-request-failed") {
        setError(
          "La connexion au réseau a échoué. Veuillez vérifier votre connexion internet."
        );
      } else {
        setError(
          "Une erreur s'est produite lors de la création du compte. Veuillez réessayer."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowTermsModal(true);
  };


  return (
    <div className="relative min-h-screen  py-12 px-4 sm:px-6 lg:px-8">
      <Image
        src="/unibtp.png"
        width={500}
        height={500}
        alt="Company Registration"
        className=" absolute top-0 left-0 w-full h-full object-cover z-0"
      />
      <div className="absolute top-0 left-0 w-full h-full bg-black/20" />

      <div className="absolute left-[5%] right-[5%] md:left-[25%] md:right-[25%] mx-auto rounded-sm  py-12 px-4 sm:px-6 lg:px-8 z-50">
        <Card className="max-w-2xl mx-auto bg-white ">
          <CardHeader className="flex flex-col gap-3">
            <h2 className="text-center text-3xl font-extrabold text-gray-900">
              Enregistrez votre entreprise
            </h2>
            <Progress
              aria-label="Registration Progress"
              value={(currentStep / 3) * 100}
              className="max-w-md"
              color="primary"
            />
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
          </CardHeader>

          <CardBody>
            <form onSubmit={handleFormSubmit} className="space-y-6">
              {currentStep === 1 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">
                    Informations de l'entreprise
                  </h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Input
                      name="companyName"
                      label="Nom de l'entreprise"
                      variant="bordered"
                      value={formData.companyName}
                      onChange={handleChange}
                      required
                      classNames={{
                        input: "border-black",
                        inputWrapper: "border-2 border-black/20 hover:border-black focus-within:!border-black"
                      }}
                    />
                    <Input
                      name="registrationNumber"
                      label="Numéro d'enregistrement"
                      variant="bordered"
                      value={formData.registrationNumber}
                      onChange={handleChange}
                      required
                      classNames={{
                        input: "border-black",
                        inputWrapper: "border-2 border-black/20 hover:border-black focus-within:!border-black"
                      }}
                    />
                    <Input
                      name="taxId"
                      label="Numéro d'identification fiscale"
                      variant="bordered"
                      value={formData.taxId}
                      onChange={handleChange}
                      required
                      classNames={{
                        input: "border-black",
                        inputWrapper: "border-2 border-black/20 hover:border-black focus-within:!border-black"
                      }}
                    />
                    <Input
                      name="industry"
                      label="Secteur d'activité"
                      variant="bordered"
                      value={formData.industry}
                      onChange={handleChange}
                      required
                      classNames={{
                        input: "border-black",
                        inputWrapper: "border-2 border-black/20 hover:border-black focus-within:!border-black"
                      }}
                    />
                    <Input
                      name="foundedDate"
                      type="date"
                      label="Date de création"
                      variant="bordered"
                      value={formData.foundedDate}
                      onChange={handleChange}
                      required
                      classNames={{
                        input: "border-black",
                        inputWrapper: "border-2 border-black/20 hover:border-black focus-within:!border-black"
                      }}
                    />
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">
                    Informations de contact
                  </h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Input
                      name="email"
                      type="email"
                      label="Email de l'entreprise"
                      variant="bordered"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                    <Input
                      name="phone"
                      type="tel"
                      label="Numéro de téléphone"
                      variant="bordered"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                    <Input
                      name="website"
                      type="url"
                      label="Site web"
                      variant="bordered"
                      value={formData.website}
                      onChange={handleChange}
                    />
                    <Input
                      name="address"
                      label="Adresse"
                      variant="bordered"
                      value={formData.address}
                      onChange={handleChange}
                      required
                    />
                    <Input
                      name="city"
                      label="Ville"
                      variant="bordered"
                      value={formData.city}
                      onChange={handleChange}
                      required
                    />
                    <Input
                      name="country"
                      label="Pays"
                      variant="bordered"
                      value={formData.country}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">
                    Informations du CEO et configuration du compte
                  </h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Input
                      name="ceoName"
                      label="Nom complet du CEO"
                      variant="bordered"
                      value={formData.ceoName}
                      onChange={handleChange}
                      required
                    />
                    <Input
                      name="ceoEmail"
                      type="email"
                      label="Email du CEO"
                      variant="bordered"
                      value={formData.ceoEmail}
                      onChange={handleChange}
                      required
                    />
                    <Input
                      name="ceoPhone"
                      type="tel"
                      label="Numéro de téléphone du CEO"
                      variant="bordered"
                      value={formData.ceoPhone}
                      onChange={handleChange}
                      required
                    />
                    <Input
                      name="password"
                      type="password"
                      label="Mot de passe"
                      variant="bordered"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <Input
                      name="confirmPassword"
                      type="password"
                      label="Confirmer le mot de passe"
                      variant="bordered"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-between">
                {currentStep > 1 && (
                  <Button
                    color="default"
                    variant="flat"
                    onPress={() => setCurrentStep((prev) => prev - 1)}
                  >
                    Précedent
                  </Button>
                )}

                {currentStep < 3 ? (
                  <Button
                    color="primary"
                    onPress={() => setCurrentStep((prev) => prev + 1)}
                  >
                    Suivant
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    color="primary"
                    isLoading={loading}
                    disabled={loading}
                    spinner={<Spinner size="sm" color="white" />}
                  >
                    {loading ? "Création du compte..." : "Valider"}
                  </Button>
                )}
              </div>

              <div className="text-sm text-center">
                <Link
                  href="/login"
                  className="font-medium text-main hover:text-indigo-500"
                >
                  Vous avez déjà un compte? Connectez-vous
                </Link>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>

      <Modal
        isOpen={showTermsModal}
        onOpenChange={setShowTermsModal}
        size="2xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Conditions d'utilisation
              </ModalHeader>
              <ModalBody>
                <div className="max-h-[400px] overflow-y-auto">
                  <h3 className="font-semibold mb-2">Termes et conditions</h3>
                  <p className="mb-4">
                    En créant un compte, vous acceptez nos conditions
                    d'utilisation et notre politique de confidentialité.
                  </p>
                  {/* Add more terms content here */}
                  <div className="mt-4">
                    <Checkbox
                      isSelected={acceptedTerms}
                      onValueChange={setAcceptedTerms}
                    >
                      J'accepte les conditions d'utilisation et la politique de
                      confidentialité
                    </Checkbox>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Annuler
                </Button>
                <Button
                  color="primary"
                  onPress={handleSubmit}
                  isDisabled={!acceptedTerms}
                  isLoading={loading}
                  spinner={<Spinner size="sm" color="white" />}
                >
                  Confirmer l'inscription
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
