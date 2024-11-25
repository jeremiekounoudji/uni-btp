'use client'
import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardHeader, CardBody, Input, Button } from "@nextui-org/react";

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push('/dashboard') // Redirect to home page after successful login
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Image
        src="/unibtp.png" // Update with your image path
        width={500}
        height={300}
        alt="Login Background"
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      />
  <div className="absolute top-0 left-0 w-full h-full bg-black/20" />

      <div className="absolute left-[5%] right-[5%] md:left-[35%] md:right-[35%] mx-auto z-50">
        <Card className="bg-white">
          <CardHeader className="flex flex-col gap-3">
            <h2 className="text-center text-3xl font-extrabold text-gray-900">
              Connectez-vous à votre compte
            </h2>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
          </CardHeader>
          
          <CardBody>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  label="Email"
                  variant="bordered"
                  required
                  placeholder="Entrez votre email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                  
                <Input
                  id="password"
                  name="password"
                  type="password"
                  label="Password"
                  variant="bordered"
                  required
                  placeholder="Entrez votre mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <Button
                type="submit"
                color="primary"
                className="w-full bg-main"
                isLoading={loading}
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign in"}
              </Button>

              <div className="text-sm text-center">
                <span>Vous n'avez pas de compte? </span>
                <Link
                  href="/register"
                  className="font-medium text-main hover:text-indigo-500"
                >
                  S'inscrire ici
                </Link>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  )
} 