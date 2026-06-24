import Link from 'next/link'
import './not-found.css'
import Box from '@mui/material/Box';

export default function NotFound() {
  return (
    <Box className="not-found">
      <h2 className='fourzerofour'>404</h2>
      <h3 className='pnf'>Page Not Found</h3>
      <p className='para'>Could not find the requested resource.</p>
      <Link href="/">
        <button className='btn'>Go Back Home</button>
      </Link>
    </Box>
  )
}