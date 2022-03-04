import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";

const Container = styled.div`
  height: 60vh;
  justify-content: flex-start;
  align-items: center;
  display: flex;
  flex-direction: column;
  padding: 30px;
  background: ${uiColors.gray.light2};
`;

export default Container;