import { Box, Button, FormGroup, TextField } from "@mui/material";
import React, { useEffect } from "react";
import SearchIcon from '@mui/icons-material/Search';
import {
    useConnection,
} from "../contexts";

import { useMemo } from 'react';
import {
    useWallet,
} from "@solana/wallet-adapter-react";

import * as anchor from '@project-serum/anchor';
import { searchEntanglements } from "../utils/entangler";


export const Search = () => {
    const connection = useConnection();
    console.log(connection);
    const wallet = useWallet();
    const [entanglements, setEntanglements] = React.useState<Array<object>>([]);
    const anchorWallet = useMemo(() => {
        if (
            !wallet ||
            !wallet.publicKey ||
            !wallet.signAllTransactions ||
            !wallet.signTransaction
        ) {
            return;
        }

        return {
            publicKey: wallet.publicKey,
            signAllTransactions: wallet.signAllTransactions,
            signTransaction: wallet.signTransaction,
        } as anchor.Wallet;
    }, [wallet]);

    useEffect(() => {
        (async () => {
            if (!anchorWallet) {
                return;
            }
            setAuthority(anchorWallet.publicKey.toString())

        })()
    }, [
        anchorWallet,
    ]);

    const handleSubmit = async (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        if (!anchorWallet) {
            return;
        }
        const foundEntanglements = await searchEntanglements(anchorWallet, connection, mintA, authority);
        setEntanglements([...foundEntanglements]);
        console.log(entanglements)
    }

    const [mintA, setMintA] = React.useState(localStorage.getItem("mintA") || "");
    const [authority, setAuthority] = React.useState(localStorage.getItem("authority") || "");
    return (
        <React.Fragment>
            <h1>Search Entanglements</h1>
            <p>Search for entanglements by mint address and authority</p>

            <Box
                component="form"
                sx={{
                    '& .MuiTextField-root': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
            >
                <TextField
                    id="mintA-text-field"
                    label="MintA"
                    value={mintA}
                    onChange={(e) => {
                        localStorage.setItem("mintA", e.target.value);
                        setMintA(e.target.value);
                    }}
                />
                <TextField
                    id="mintA-text-field"
                    label="Authority"
                    value={authority}
                    onChange={(e) => {
                        localStorage.setItem("authority", e.target.value);
                        setAuthority(e.target.value);
                    }}
                />
                <FormGroup>
                    <Button disabled={!authority || !mintA} variant="contained" onClick={async (e) => await handleSubmit(e)} endIcon={<SearchIcon />}>
                        Search Entanglements
                    </Button>
                </FormGroup>
                <Box sx={{ maxWidth: 'md', display: 'block', marginTop: '2rem' }}>
                    <h2>Entanglements</h2>
                    {/* {entanglements.map((entanglement) => (<li key={getTokenEntanglement(entanglement?.mintA, entanglement?.mintB)}>{mint}</li>))} */}
                </Box>
            </Box>

        </React.Fragment>
    );

}