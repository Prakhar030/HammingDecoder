import React, { useState } from 'react'
import { StyleSheet, css } from "aphrodite";

function Decoder() {
    const [parity, setparity] = useState(3);
    const [codeword, setcodeword] = useState([0]);
    const [paritybits, setparitybits] = useState([0]);
    const [messagebits, setmessagebits] = useState([0]);
    const [showsplit, setshowsplit] = useState(false);
    const [showsyndrome, setshowsyndrome] = useState(false);
    const [paritycontroller, setparitycontroller] = useState(false);
    const [output, setoutput] = useState(" ");


    const isPowerOfTwo = (n: number) => {
        if (n === 0)
            return 0;
        while (n !== 1) {
            if (n % 2 !== 0)
                return 0;
            n = n / 2;
        }
        return 1;
    }
    const xorOfArray = (arr: number[], n: number) => {
        let xor_arr = 0;
        for (let i = 0; i < n; i++) {
            xor_arr = xor_arr ^ arr[i];
        }

        return xor_arr;
    }
    const parityfinder = (codeword: string | any[]) => {
        var tempparitybits = []
        var tempmsgbits = []
        for (var i = 1; i <= (codeword.length); i++) {
            if (isPowerOfTwo(i)) { tempparitybits.push(codeword[i - 1]) }
            else { tempmsgbits.push(codeword[i - 1]) }

        }
        setparitybits(tempparitybits);
        setmessagebits(tempmsgbits);
        

    }
    const syndromeformer = (codeword: string | any[], paritybits: any) => {
        var templol = [];
        var tempsyndrome  = [];
        
        for (var i = 0; i < paritybits.length; i++) {
            templol.push([paritybits[i]]);
        }
        
        for (var i2 = 1; i2 <= (codeword.length); i2++) {
            if (!(isPowerOfTwo(i2))) {
                const positioninBits = i2.toString(2);

                for (var j1 = positioninBits.length - 1; j1 >= 0; j1--) {
                    if (positioninBits[j1] === "1") {
                        templol[positioninBits.length - 1 - j1].push(codeword[i2 - 1]);
                    }
                }

            }

        }
        
        for (var k = 0; k < templol.length; k++) {

            tempsyndrome.push(xorOfArray(templol[k], templol[k].length));
        }
        
        const sum = tempsyndrome.reduce((result, number) => result + number);
        if (sum === 0) {
            setoutput("The codeword has no errors!!!")
        }
        else {
            var position = 0;
            for (var i1 = tempsyndrome.length - 1; i1 >= 0; i1--) {
                position = position + tempsyndrome[i1] * (2 ** (i1));
            }
            var newmessage = "";

            const newcodeword = Array(codeword.length);
            for (var j = 0; j < codeword.length; j++) {
                if (j === position - 1) { newcodeword[j] = 1 ^ codeword[j]; }
                else { newcodeword[j] = codeword[j]; }
            }

            newmessage = "The correct codeword would be " + newcodeword.join('') + " ."

            setoutput("There was an error at position " + position + ". " + newmessage)

        }

    }
    return (
        <>
            <div className={css(styles.title)}><div style={{ fontFamily: 'Montserrat', fontStyle: 'normal', fontWeight: '300', fontSize: '32px', lineHeight: '39px', color: '#000000' }}>Hamming</div><div style={{ fontFamily: 'Montserrat', fontStyle: 'normal', fontWeight: '800', fontSize: '32px', lineHeight: '39px', color: '#5246FF' }}>Decoder</div></div>
            <div className={css(styles.outerbox)} >
                <div style={{ backgroundColor: 'white', borderRadius: '32px', height: '100%' }}>
                    {!paritycontroller &&
                        <div className={css(styles.paritybox)}>
                            Number of parity bits(r):

                            <input value={parity} onChange={
                                (e) => {
                                    if (parseInt(e.target.value) >= 3) { setparity(parseInt(e.target.value)) }
                                    else { setparity(0) }
                                }
                            }
                                style={{ width: '20%', textAlign: 'center', backgroundColor: '#D9D9D9', borderRadius: '1rem', fontSize: '30px' }} />

                            <button onClick={() => { setparitycontroller(!paritycontroller) }}
                                style={{ width: '10%', fontSize: '26px', backgroundColor: '#5246FF', borderRadius: '1rem', color: 'white' }}
                            >Next</button>
                        </div>
                    }
                    {paritycontroller &&
                        <div className={css(styles.messageinputbox)}>
                            {!(showsplit) && <>
                                Enter {(2 ** parity) - 1} bits systematiclly encoded hamming code :
                                <div>
                                    <input value={codeword.join('')}
                                        onChange={(e) => {
                                            var code = e.target.value;
                                            var splitcode = code.split("");

                                            var splitintcode = [];
                                            for (var i = 0; i < splitcode.length; i++) {
                                                splitintcode.push(parseInt(splitcode[i]));
                                            }
                                            setcodeword(splitintcode);
                                            
                                            
                                        }}
                                        onPaste={(e) => {

                                            var code = e.clipboardData.getData('text');
                                            var splitcode = code.split("");

                                            var splitintcode = [];
                                            for (var i = 0; i < splitcode.length; i++) {
                                                splitintcode.push(parseInt(splitcode[i]));
                                            }
                                            setcodeword(splitintcode);
                                            
                                        }}
                                        style={{ width: '100%', textAlign: 'center', backgroundColor: '#D9D9D9', borderRadius: '1rem', fontSize: '30px' }}
                                    />


                                    <div style={{ fontSize: '18px', textAlign: 'right', color: '#5246FF' }}>
                                        {((2 ** parity) - 1) - codeword.length} bits to go...
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'row', gap: '2rem' }}>
                                    <button onClick={() => { setparitycontroller(!paritycontroller) }}
                                        style={{ fontSize: '26px', backgroundColor: '#5246FF', borderRadius: '1rem', color: 'white' }}
                                    >Prev</button>

                                    <button value={""}
                                        onClick={
                                            () => {
                                                parityfinder(codeword);
                                                setshowsplit(!showsplit);
                                                
                                            }
                                        }
                                        
                                        style={{ fontSize: '26px', backgroundColor: '#5246FF', borderRadius: '1rem', color: 'white' }}
                                    >Next</button>
                                </div>
                            </>}
                            {showsplit &&
                                <div>
                                    {!showsyndrome &&
                                        <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', gap: '2rem' }}>
                                            parity bits:{paritybits} , message bits:{messagebits}
                                            <div style={{ display: 'flex', flexDirection: 'row', gap: '2rem' }}>
                                                <button value={""}
                                                    onClick={
                                                        () => {
                                                            setshowsplit(!showsplit);
                                                        }
                                                    }
                                                    style={{ fontSize: '26px', backgroundColor: '#5246FF', borderRadius: '1rem', color: 'white' }}
                                                >prev</button>
                                                <button value={""}
                                                    onClick={
                                                        () => {
                                                            syndromeformer(codeword, paritybits);
                                                            setshowsyndrome(!showsyndrome);
                                                            
                                                        }
                                                    }
                                                    style={{ fontSize: '26px', backgroundColor: '#5246FF', borderRadius: '1rem', color: 'white' }}
                                                >Next</button>
                                            </div>
                                        </div>
                                    }
                                    {showsyndrome &&
                                        <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', gap: '2rem' }}>
                                            {output}
                                            <button value={""}
                                                onClick={
                                                    () => {

                                                        setshowsyndrome(!showsyndrome);
                                                    }
                                                }
                                                style={{ fontSize: '26px', backgroundColor: '#5246FF', borderRadius: '1rem', color: 'white' }}
                                            >prev</button>
                                        </div>}
                                </div>}
                        </div>}
                </div>
            </div>
        </>

    )
}

export default Decoder

const styles = StyleSheet.create({
    title: {
        height: '5rem',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',

    },
    outerbox: {
        backgroundColor: '#F5F6F6',
        width: '96%',
        height: '37.5rem',
        borderRadius: '32px',
        paddingTop: '24px',
        paddingLeft: '24px',
        boxShadow: '4px 4px 15px rgba(0, 0, 0, 0.12)',
        fontFamily: 'Montserrat',
        fontStyle: 'normal'
    },
    paritybox: {
        paddingTop: '10rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        alignItems: 'center',
    },
    messageinputbox: {
        paddingTop: '10rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        alignItems: 'center',
    },


})