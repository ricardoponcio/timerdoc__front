import { Box } from '@chakra-ui/react';
import classNames from 'classnames';
import { AuthContext } from 'context/Auth/AuthContext';
import { CompanyContext } from 'context/Company/CompanyContext';
import { useContext } from 'react';
import { MdDoubleArrow, MdKeyboardArrowRight } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import './Sidebar.sass';

// Sem mais uso depois de 2023-07-06, caso mais de dois meses sem uso em codigo remover
function Sidebar2({ collapsed = false }: { collapsed: boolean }) {
  const auth = useContext(AuthContext);
  const empresas = auth.getCompanys();
  const compCtx = useContext(CompanyContext);
  const navigate = useNavigate();
  const handleSelectCompany = (id: number) => {
    auth.selectCompany(id);
    navigate('/');
  };
  return (
    <nav className={classNames('sidebar', { collapsed: collapsed })}>
      <div id="logo"></div>
      <section>
        <ul className="nav-items">
          {empresas &&
            (empresas?.length || 0) > 0 &&
            empresas?.map((item) => (
              <li
                className={'nav-item' + (item.id == compCtx.company?.id ? ' select' : '')}
                key={item.id}
                onClick={() => handleSelectCompany(item.id)}
              >
                {item.id == compCtx.company?.id ? <MdDoubleArrow /> : <MdKeyboardArrowRight />}
                <Box title={item.razaoSocial}>
                  {/* {!collapsed && <span className="text">{item.razaoSocial}</span>} */}
                  {item.fantasia}
                  {item.razaoSocial}
                </Box>
              </li>
            ))}
        </ul>
        <div>armazenamento</div>
      </section>
    </nav>
  );
}

export default Sidebar2;
