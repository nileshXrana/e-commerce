import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import Link from 'next/link';
import '../page.css';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: '8px',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        borderColor: 'rgba(255, 255, 255, 0.4)',
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'rgba(255, 255, 255, 0.8)',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: '#ffffff',
    width: '100%',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        [theme.breakpoints.up('sm')]: {
            width: '14ch',
            '&:focus': {
                width: '22ch',
            },
        },
    },
}));

export default function Navbar({filterHelper}) {
    return (
        <Box sx={{ flexGrow: 1 }} className='sticky top-0 z-10'>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography
                        variant="h5"
                        noWrap
                        component="div"
                        sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                    >
                        <div className='font-bold font-mono'>E-commerce Store</div>
                    </Typography>

                    <Link href="/cart" style={{ color: 'inherit', textDecoration: 'none' }}>
                        <IconButton color="inherit" aria-label="add to shopping cart" className='font-bold'>
                            <AddShoppingCartIcon/>
                        </IconButton>
                    </Link>

                    {filterHelper && (
                        <Search>
                            <SearchIconWrapper>
                                <SearchIcon />
                            </SearchIconWrapper>
                            <StyledInputBase
                                placeholder="Search..."
                                inputProps={{ 'aria-label': 'search' }}
                                onChange={filterHelper}
                            />
                        </Search>
                    )}    
                    
                </Toolbar>
            </AppBar>
        </Box>
    );
}
