import { Grid, Container, MenuItem, TextField, Typography, Avatar, useTheme, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import { useState, useRef, useEffect } from "react";
import supportedLanguages from "../data/supportedLanguages.json";
import { Editor } from "@monaco-editor/react";
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { MonacoBinding } from 'y-monaco';
import { editor } from "monaco-editor";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {changeLanguage, getRoomById, joinRoom} from "../services/room";
import { useContext } from "react";
import { SocketContext } from "../context/SocketContext";
import {
    uniqueNamesGenerator,
    Config,
    adjectives,
    names,
    languages
} from "unique-names-generator";
import {pink} from "@mui/material/colors";
const serverWsUrl = import.meta.env.VITE_SERVER_WS_URL;

export default function CodeRoom() {
    const theme = useTheme();
    const params = useParams();
    console.log('params:::', params)
    const [language, setLanguage] = useState('');
    const [participant, setParticipant] = useState(params.participant);
    const [participants, setParticipants] = useState<string[]>([]);
    const socket = useContext(SocketContext);

    const HandleLanguageChange = (language: string) => {
        setLanguage(language);
        changeLanguage(language, params.roomId)
        .then((data) => console.log("Language changed to " + data.programmingLanguage));
        socket.emit('language:change', {"language": language, "roomId": params.roomId });
    }

    const editorRef = useRef<editor.IStandaloneCodeEditor>();
    
    function handleEditorDidMount(editor: editor.IStandaloneCodeEditor) {
        editorRef.current = editor;

        // Initialize yjs
        const doc = new Y.Doc(); // collection of shared objects

        // Connect to peers with Web RTC
        console.log(serverWsUrl)
        const provider: WebsocketProvider = new WebsocketProvider(serverWsUrl, params.roomId, doc);
        const type = doc.getText("monaco");

        // Bind yjs doc to Manaco editor
        const binding = new MonacoBinding(type, editorRef.current!.getModel()!, new Set([editorRef.current!]));
        console.log(binding, provider);

    }
    const navigate = useNavigate()

    const newString = () => {
        const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

        const config: Config = {
            dictionaries: [names],
            separator: "-",
            length: 1,
            style: "capital"
        };

        const randomString = uniqueNamesGenerator(config);

        return `${randomString}`;
    };
    useEffect(()=> {
        getRoomById(params.roomId).then(data => {
            setParticipants(data.participants);
            setLanguage(data.programmingLanguage);
            console.log('participant:::', participant)
            if (participant === undefined || participant === '') {
                const name = newString()
                joinRoom(name, params.roomId)
                    .then((data) => {
                        setParticipant(name)
                        navigate(`/room/${data.roomId}/${name}`, { replace: true  })
                    })
            }
        })
    }, [params.roomId])
    useEffect(() => {
      socket.on('participant:add', (data) => {
        if(data.roomId == params.roomId) {
            console.log('participant:add', data);
            setParticipants(data.participants);
            setLanguage(data.programmingLanguage);
        }
      })
      socket.on('language:change', (data) => {
          if(data.roomId == params.roomId) {
            console.log('language:change',data);
            setLanguage(data.language);
        }

      })
    
      return () => {

      }
    }, [])
    
    
    return (
        <>
        <Grid container>
            <Grid item xs={12} md={10}>
                <Editor 
                height="100vh"
                language={language}
                defaultValue={"// your code here"}
                theme={theme.palette.mode === "dark" ? "vs-dark" : "vs-light"}
                onMount={handleEditorDidMount}
                />
            </Grid>
            <Grid item xs={12} md={2} sx={{ padding: '24px' }}>
                <Typography variant="subtitle1">Room ID: {params.roomId}</Typography>
                <TextField 
                sx={{
                    width: '100%',
                    marginBlock: '4em'
                }}
                variant="standard"
                size="small"
                select
                label="Programming Language"
                value={language}
                defaultValue="typescript"
                >
                    {supportedLanguages.map((option) => (
                        <MenuItem key={option.value} value={option.value} onClick={() => HandleLanguageChange(option.value)}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
                <Typography variant="body1">Participants</Typography>
                <Container disableGutters sx={{ marginBlock: '1em' }}>
                {participants.map((p) => (
                    <ListItem key={p} sx={{ paddingLeft: '0' }}>
                        <ListItemAvatar>
                            <Avatar sx={{ bgcolor: participant === p ? pink[500]: '' }}  alt={p}>{ p[0].toUpperCase() }</Avatar>
                        </ListItemAvatar>
                        <ListItemText 
                         primary={p}
                        />
                    </ListItem>
                ))}
                </Container>
            </Grid>
        </Grid>
        </>
    );
}