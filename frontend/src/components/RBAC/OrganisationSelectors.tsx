import React, { useState, useEffect } from "react"
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent,
    CircularProgress,
    Box,
    Alert,
} from "@mui/material"
import { rbacAPI } from "../../services/api"
import type { Role, Universite, Faculte, Departement } from "../../types"

// ===== SÉLECTEUR DE RÔLES =====

interface RoleSelectorProps {
    value: number | null
    onChange: (roleId: number | null) => void
    label?: string
    required?: boolean
    disabled?: boolean
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({
    value,
    onChange,
    label = "Rôle",
    required = false,
    disabled = false,
}) => {
    const [roles, setRoles] = useState<Role[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchRoles = async () => {
            setLoading(true)
            setError(null)
            try {
                console.log(
                    "🔍 Tentative de récupération des rôles depuis l'API..."
                )
                const data = await rbacAPI.getRoles()
                console.log("✅ Rôles récupérés avec succès:", data)
                setRoles(data)
            } catch (err: any) {
                const errorMessage =
                    err.response?.status === 404
                        ? "Endpoint /api/roles/ non trouvé. Vérifiez que le backend est démarré."
                        : err.message === "Network Error"
                        ? "❌ BACKEND NON DISPONIBLE - Veuillez démarrer le serveur Django sur http://127.0.0.1:8000"
                        : "Erreur lors du chargement des rôles"

                setError(errorMessage)
                console.error(
                    "❌ Erreur lors de la récupération des rôles:",
                    err
                )
                console.error("   Type d'erreur:", err.message)
                console.error("   Status:", err.response?.status)
                console.error("   Données:", err.response?.data)
            } finally {
                setLoading(false)
            }
        }

        fetchRoles()
    }, [])

    const handleChange = (event: SelectChangeEvent<number>) => {
        const roleId = event.target.value as number
        onChange(roleId || null)
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>
    }

    return (
        <FormControl fullWidth required={required} disabled={disabled}>
            <InputLabel>{label}</InputLabel>
            <Select
                value={value || ""}
                onChange={handleChange}
                label={label}
                startAdornment={loading ? <CircularProgress size={20} /> : null}
            >
                <MenuItem value="">
                    <em>Sélectionner un rôle</em>
                </MenuItem>
                {roles.map((role) => (
                    <MenuItem key={role.id} value={role.id}>
                        {role.nom} - {role.description}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}

// ===== SÉLECTEUR D'UNIVERSITÉS =====

interface UniversiteSelectorProps {
    value: number | null
    onChange: (universiteId: number | null) => void
    label?: string
    required?: boolean
    disabled?: boolean
}

export const UniversiteSelector: React.FC<UniversiteSelectorProps> = ({
    value,
    onChange,
    label = "Université",
    required = false,
    disabled = false,
}) => {
    const [universites, setUniversites] = useState<Universite[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchUniversites = async () => {
            setLoading(true)
            setError(null)
            try {
                console.log("🔍 Tentative de récupération des universités...")
                const data = await rbacAPI.getUniversites()
                console.log("✅ Universités récupérées:", data)
                setUniversites(data)
            } catch (err: any) {
                const errorMessage =
                    err.message === "Network Error"
                        ? "❌ BACKEND NON DISPONIBLE - Le serveur Django n'est pas accessible"
                        : "Erreur lors du chargement des universités"

                setError(errorMessage)
                console.error("❌ Erreur universités:", err)
            } finally {
                setLoading(false)
            }
        }

        fetchUniversites()
    }, [])

    const handleChange = (event: SelectChangeEvent<number>) => {
        const universiteId = event.target.value as number
        onChange(universiteId || null)
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>
    }

    return (
        <FormControl fullWidth required={required} disabled={disabled}>
            <InputLabel>{label}</InputLabel>
            <Select
                value={value || ""}
                onChange={handleChange}
                label={label}
                startAdornment={loading ? <CircularProgress size={20} /> : null}
            >
                <MenuItem value="">
                    <em>Sélectionner une université</em>
                </MenuItem>
                {universites.map((universite) => (
                    <MenuItem key={universite.id} value={universite.id}>
                        {universite.nom} ({universite.code})
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}

// ===== SÉLECTEUR DE FACULTÉS =====

interface FaculteSelectorProps {
    value: number | null
    onChange: (faculteId: number | null) => void
    universiteId: number | null
    label?: string
    required?: boolean
    disabled?: boolean
}

export const FaculteSelector: React.FC<FaculteSelectorProps> = ({
    value,
    onChange,
    universiteId,
    label = "Faculté",
    required = false,
    disabled = false,
}) => {
    const [facultes, setFacultes] = useState<Faculte[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchFacultes = async () => {
            if (!universiteId) {
                setFacultes([])
                onChange(null) // Reset selection when université changes
                return
            }

            setLoading(true)
            setError(null)
            try {
                const data = await rbacAPI.getFacultes(universiteId)
                setFacultes(data)

                // Reset selection if current faculté doesn't belong to new université
                if (value && !data.some((f) => f.id === value)) {
                    onChange(null)
                }
            } catch (err) {
                setError("Erreur lors du chargement des facultés")
                console.error("Erreur facultés:", err)
            } finally {
                setLoading(false)
            }
        }

        fetchFacultes()
    }, [universiteId, value, onChange])

    const handleChange = (event: SelectChangeEvent<number>) => {
        const faculteId = event.target.value as number
        onChange(faculteId || null)
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>
    }

    const isDisabled = disabled || !universiteId

    return (
        <FormControl fullWidth required={required} disabled={isDisabled}>
            <InputLabel>{label}</InputLabel>
            <Select
                value={value || ""}
                onChange={handleChange}
                label={label}
                startAdornment={loading ? <CircularProgress size={20} /> : null}
            >
                <MenuItem value="">
                    <em>
                        {universiteId
                            ? "Sélectionner une faculté"
                            : "Sélectionner d'abord une université"}
                    </em>
                </MenuItem>
                {facultes.map((faculte) => (
                    <MenuItem key={faculte.id} value={faculte.id}>
                        {faculte.nom} ({faculte.code})
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}

// ===== SÉLECTEUR DE DÉPARTEMENTS =====

interface DepartementSelectorProps {
    value: number | null
    onChange: (departementId: number | null) => void
    faculteId: number | null
    label?: string
    required?: boolean
    disabled?: boolean
}

export const DepartementSelector: React.FC<DepartementSelectorProps> = ({
    value,
    onChange,
    faculteId,
    label = "Département",
    required = false,
    disabled = false,
}) => {
    const [departements, setDepartements] = useState<Departement[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchDepartements = async () => {
            if (!faculteId) {
                setDepartements([])
                onChange(null) // Reset selection when faculté changes
                return
            }

            setLoading(true)
            setError(null)
            try {
                const data = await rbacAPI.getDepartements(faculteId)
                setDepartements(data)

                // Reset selection if current département doesn't belong to new faculté
                if (value && !data.some((d) => d.id === value)) {
                    onChange(null)
                }
            } catch (err) {
                setError("Erreur lors du chargement des départements")
                console.error("Erreur départements:", err)
            } finally {
                setLoading(false)
            }
        }

        fetchDepartements()
    }, [faculteId, value, onChange])

    const handleChange = (event: SelectChangeEvent<number>) => {
        const departementId = event.target.value as number
        onChange(departementId || null)
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>
    }

    const isDisabled = disabled || !faculteId

    return (
        <FormControl fullWidth required={required} disabled={isDisabled}>
            <InputLabel>{label}</InputLabel>
            <Select
                value={value || ""}
                onChange={handleChange}
                label={label}
                startAdornment={loading ? <CircularProgress size={20} /> : null}
            >
                <MenuItem value="">
                    <em>
                        {faculteId
                            ? "Sélectionner un département"
                            : "Sélectionner d'abord une faculté"}
                    </em>
                </MenuItem>
                {departements.map((departement) => (
                    <MenuItem key={departement.id} value={departement.id}>
                        {departement.nom} ({departement.code})
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}

// ===== COMPOSANT COMBINÉ POUR SÉLECTION HIÉRARCHIQUE COMPLÈTE =====

interface OrganisationSelectorProps {
    universite: number | null
    faculte: number | null
    departement: number | null
    onUniversiteChange: (universiteId: number | null) => void
    onFaculteChange: (faculteId: number | null) => void
    onDepartementChange: (departementId: number | null) => void
    required?: boolean
    disabled?: boolean
}

export const OrganisationSelector: React.FC<OrganisationSelectorProps> = ({
    universite,
    faculte,
    departement,
    onUniversiteChange,
    onFaculteChange,
    onDepartementChange,
    required = false,
    disabled = false,
}) => {
    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <UniversiteSelector
                value={universite}
                onChange={onUniversiteChange}
                required={required}
                disabled={disabled}
            />

            <FaculteSelector
                value={faculte}
                onChange={onFaculteChange}
                universiteId={universite}
                required={required}
                disabled={disabled}
            />

            <DepartementSelector
                value={departement}
                onChange={onDepartementChange}
                faculteId={faculte}
                required={required}
                disabled={disabled}
            />
        </Box>
    )
}
